import { Routes } from '@angular/router';
import { MesAppartementsComponent } from './mes-appartements/mes-appartements.component';
import { MesPaiementsComponent } from './mes-paiements/mes-paiements.component';
import { MesIncidentsComponent } from './mes-incidents/mes-incidents.component';

export const PROPRIETAIRE_ROUTES: Routes = [
  {
    path: '',
    component: MesAppartementsComponent
  },
  {
    path: 'mes-appartements',
    component: MesAppartementsComponent
  },
  {
    path: 'mes-paiements',
    component: MesPaiementsComponent
  },
  {
    path: 'mes-incidents',
    component: MesIncidentsComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
]; 
