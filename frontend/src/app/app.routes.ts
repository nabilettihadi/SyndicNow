import {Routes} from '@angular/router';
import {AuthGuard, DashboardGuard} from '@core/guards/auth.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard-redirect.component').then(m => m.DashboardRedirectComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'syndic',
    canActivate: [authGuard],
    data: { roles: ['SYNDIC'] },
    loadChildren: () => import('./features/syndic/syndic.routes').then(m => m.SYNDIC_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
      },
      {
        path: 'syndics',
        loadComponent: () => import('./features/admin/syndics/syndics.component').then(m => m.SyndicsComponent),
        loadChildren: () => import('./features/admin/syndics/syndics.routes').then(m => m.SYNDICS_ROUTES)
      },
      {
        path: 'rapports',
        loadComponent: () => import('./features/admin/reports/reports.component').then(m => m.ReportsComponent)
      }
    ]
  },
  {
    path: 'proprietaire',
    canActivate: [authGuard],
    data: { roles: ['PROPRIETAIRE'] },
    loadChildren: () => import('./features/proprietaire/proprietaire.routes').then(m => m.PROPRIETAIRE_ROUTES)
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
