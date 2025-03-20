import { Routes } from '@angular/router';

export const SYNDIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/syndic-dashboard.component').then(m => m.SyndicDashboardComponent)
  },
  {
    path: 'immeubles',
    loadComponent: () => import('./immeubles/list-immeubles.component').then(m => m.ListImmeublesComponent)
  },
  {
    path: 'appartements',
    loadComponent: () => import('./appartements/list-appartements.component').then(m => m.ListAppartementsComponent)
  },
  {
    path: 'paiements',
    loadComponent: () => import('./paiements/list-paiements.component').then(m => m.ListPaiementsComponent)
  },
  // Rediriger toutes les autres routes vers le dashboard
  {
    path: '**',
    redirectTo: ''
  }
]; 