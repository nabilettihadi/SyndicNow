import { Routes } from '@angular/router';

export const PROPRIETAIRES_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./list-proprietaires/list-proprietaires.component').then(m => m.ListProprietairesComponent)
      },
      {
        path: 'nouveau',
        loadComponent: () => import('./add-proprietaire/add-proprietaire.component').then(m => m.AddProprietaireComponent)
      },
      {
        path: ':id/modifier',
        loadComponent: () => import('./edit-proprietaire/edit-proprietaire.component').then(m => m.EditProprietaireComponent)
      },
      {
        path: ':id/appartements',
        loadComponent: () => import('./proprietaire-appartements/proprietaire-appartements.component').then(m => m.ProprietaireAppartementsComponent)
      }
    ]
  }
]; 