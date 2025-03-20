import { Routes } from '@angular/router';

export const PROPRIETAIRE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/proprietaire-dashboard.component').then(m => m.ProprietaireDashboardComponent)
  },
  {
    path: 'mes-appartements',
    loadComponent: () => import('./mes-appartements/mes-appartements.component').then(m => m.MesAppartementsComponent)
  },
  {
    path: 'mes-paiements',
    loadComponent: () => import('./mes-paiements/mes-paiements.component').then(m => m.MesPaiementsComponent)
  },
  {
    path: 'mes-documents',
    loadComponent: () => import('./mes-documents/mes-documents.component').then(m => m.MesDocumentsComponent)
  },
  // Rediriger toutes les autres routes vers le dashboard
  {
    path: '**',
    redirectTo: ''
  }
]; 