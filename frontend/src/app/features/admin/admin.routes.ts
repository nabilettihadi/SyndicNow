import {Routes} from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'syndics',
        loadComponent: () => import('./syndics/syndics.component').then(m => m.SyndicsComponent),
        loadChildren: () => import('./syndics/syndics.routes').then(m => m.SYNDICS_ROUTES)
      },
      {
        path: 'proprietaires',
        loadComponent: () => import('./proprietaires/proprietaires.component').then(m => m.ProprietairesComponent),
        loadChildren: () => import('./proprietaires/proprietaires.routes').then(m => m.PROPRIETAIRES_ROUTES)
      },
      {
        path: 'immeubles',
        loadComponent: () => import('./immeubles/immeubles.component').then(m => m.ImmeublesComponent),
        loadChildren: () => import('./immeubles/immeubles.routes').then(m => m.IMMEUBLES_ROUTES)
      }
    ]
  }
];
