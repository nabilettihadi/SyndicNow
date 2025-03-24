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
  {
    path: 'incidents',
    loadComponent: () => import('./incidents/list-incidents.component').then(m => m.ListIncidentsComponent)
  },
  {
    path: 'proprietaires',
    loadComponent: () => import('./proprietaires/list-proprietaires.component').then(m => m.ListProprietairesComponent)
  },
  {
    path: 'profil',
    loadComponent: () => import('./profil/profil.component').then(m => m.ProfilComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
]; 