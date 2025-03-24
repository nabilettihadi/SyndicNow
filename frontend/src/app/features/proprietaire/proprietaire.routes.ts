import { Routes } from '@angular/router';
import { MesAppartementsComponent } from './mes-appartements/mes-appartements.component';
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
    path: 'mes-incidents',
    component: MesIncidentsComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
]; 
