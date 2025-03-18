import {Routes} from '@angular/router';
import {AuthGuard, DashboardGuard} from '@core/guards/auth.guard';

// Composants Locataires
import { ListLocatairesComponent } from './features/locataires/list-locataires/list-locataires.component';
import { LocataireFormComponent } from './features/locataires/locataire-form/locataire-form.component';

// Composants Appartements
import { ListAppartementsComponent } from './features/appartements/list-appartements/list-appartements.component';
import { AppartementFormComponent } from './features/appartements/appartement-form/appartement-form.component';

// Composants Paiements
import { ListPaiementsComponent } from './features/paiements/list-paiements/list-paiements.component';
import { PaiementFormComponent } from './features/paiements/paiement-form/paiement-form.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/components/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [DashboardGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  // Routes pour l'Admin
  {
    path: 'admin',
    canActivate: [DashboardGuard],
    data: {role: 'ADMIN'},
    children: [
      {
        path: 'syndics',
        loadComponent: () => import('./features/admin/syndics/syndics.component').then(m => m.SyndicsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/admin/reports/reports.component').then(m => m.ReportsComponent)
      }
    ]
  },
  // Routes pour le Syndic
  {
    path: 'syndic',
    canActivate: [AuthGuard],
    data: {roles: ['SYNDIC']},
    children: [
      {
        path: 'immeubles',
        loadComponent: () => import('./features/syndics/immeubles/immeubles.component').then(m => m.ImmeublesComponent)
      },
      {
        path: 'paiements',
        loadComponent: () => import('./features/syndics/paiements/paiements.component').then(m => m.PaiementsComponent)
      },
      {
        path: 'charges',
        loadComponent: () => import('./features/syndics/charges/charges.component').then(m => m.ChargesComponent)
      }
    ]
  },
  {
    path: 'appartements',
    canActivate: [DashboardGuard],
    loadComponent: () => import('./features/appartements/appartements.component').then(m => m.AppartementsComponent),
    data: {role: 'SYNDIC'}
  },
  // Routes pour le Propriétaire
  {
    path: 'mes-appartements',
    canActivate: [DashboardGuard],
    loadComponent: () => import('./features/proprietaire/mes-appartements/mes-appartements.component').then(m => m.MesAppartementsComponent),
    data: {role: 'PROPRIETAIRE'}
  },
  {
    path: 'mes-paiements',
    canActivate: [DashboardGuard],
    loadComponent: () => import('./features/proprietaire/mes-paiements/mes-paiements.component').then(m => m.MesPaiementsComponent),
    data: {role: 'PROPRIETAIRE'}
  },
  {
    path: 'mes-documents',
    canActivate: [DashboardGuard],
    loadComponent: () => import('./features/proprietaire/mes-documents/mes-documents.component').then(m => m.MesDocumentsComponent),
    data: {role: 'PROPRIETAIRE'}
  },
  {
    path: 'profile',
    canActivate: [DashboardGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'incidents',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/incidents/list-incidents/list-incidents.component')
          .then(m => m.ListIncidentsComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'new',
        loadComponent: () => import('./features/incidents/incident-form/incident-form.component')
          .then(m => m.IncidentFormComponent),
        canActivate: [AuthGuard]
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./features/incidents/incident-form/incident-form.component')
          .then(m => m.IncidentFormComponent),
        canActivate: [AuthGuard]
      }
    ]
  },
  // Routes Locataires
  { 
    path: 'locataires', 
    component: ListLocatairesComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'locataires/new', 
    component: LocataireFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'locataires/:id', 
    component: LocataireFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'locataires/:id/edit', 
    component: LocataireFormComponent,
    canActivate: [AuthGuard]
  },

  // Routes Appartements
  { 
    path: 'appartements', 
    component: ListAppartementsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'appartements/new', 
    component: AppartementFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'appartements/:id', 
    component: AppartementFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'appartements/:id/edit', 
    component: AppartementFormComponent,
    canActivate: [AuthGuard]
  },

  // Routes Paiements
  { 
    path: 'paiements', 
    component: ListPaiementsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'paiements/new', 
    component: PaiementFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'paiements/:id', 
    component: PaiementFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'paiements/:id/edit', 
    component: PaiementFormComponent,
    canActivate: [AuthGuard]
  },

  // Route pour les pages non trouvées
  { path: '**', redirectTo: '/dashboard' }
];
