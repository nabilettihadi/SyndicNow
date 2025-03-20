import { Routes } from '@angular/router';

export const SYNDICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./list-syndics/list-syndics.component').then(m => m.ListSyndicsComponent)
  },
  // Rediriger temporairement toutes les autres routes
  {
    path: '**',
    redirectTo: ''
  }
]; 