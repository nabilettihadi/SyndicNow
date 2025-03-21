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
    path: 'messages',
    loadComponent: () => import('./messages/syndic-messages.component').then(m => m.SyndicMessagesComponent)
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
    path: 'documents',
    loadComponent: () => import('./documents/list-documents.component').then(m => m.ListDocumentsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
]; 