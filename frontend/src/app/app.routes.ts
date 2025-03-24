import {Routes} from '@angular/router';
import {authGuard, roleGuard} from '@core/guards/auth.guard';
import {UserRole} from '@core/models/user.model';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [() => roleGuard([UserRole.ADMIN])]
  },
  {
    path: 'syndic',
    loadChildren: () => import('./features/syndic/syndic.routes').then(m => m.SYNDIC_ROUTES),
    canActivate: [() => roleGuard([UserRole.SYNDIC, UserRole.ADMIN])]
  },
  {
    path: 'proprietaire',
    loadChildren: () => import('./features/proprietaire/proprietaire.routes').then(m => m.PROPRIETAIRE_ROUTES),
    canActivate: [() => roleGuard([UserRole.PROPRIETAIRE])]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard-redirect.component').then(m => m.DashboardRedirectComponent),
    canActivate: [() => authGuard()]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
