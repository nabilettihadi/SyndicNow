import { Routes } from '@angular/router';
import { ProprietaireDashboardComponent } from './dashboard/proprietaire-dashboard.component';
import { MesAppartementsComponent } from './mes-appartements/mes-appartements.component';
import { MesDocumentsComponent } from './mes-documents/mes-documents.component';
import { MesPaiementsComponent } from './mes-paiements/mes-paiements.component';
import { MesIncidentsComponent } from './mes-incidents/mes-incidents.component';

export const PROPRIETAIRE_ROUTES: Routes = [
  {
    path: '',
    component: ProprietaireDashboardComponent
  },
  {
    path: 'mes-appartements',
    component: MesAppartementsComponent
  },
  {
    path: 'mes-documents',
    component: MesDocumentsComponent
  },
  {
    path: 'mes-paiements',
    component: MesPaiementsComponent
  },
  {
    path: 'mes-incidents',
    component: MesIncidentsComponent
  },
  // Rediriger toutes les autres routes vers le dashboard
  {
    path: '**',
    redirectTo: ''
  }
]; 
