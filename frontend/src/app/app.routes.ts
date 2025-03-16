import { Routes } from '@angular/router';
import { AuthGuard, DashboardGuard } from './core/guards/auth.guard';

// Composant Home
import { HomeComponent } from './features/home/home.component';

// Composants d'authentification
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';

// Composant Dashboard
import { DashboardComponent } from './features/dashboard/dashboard.component';

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
    data: { role: 'ADMIN' },
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
    data: { roles: ['SYNDIC'] },
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
    data: { role: 'SYNDIC' }
  },
  // Routes pour le Propriétaire
  {
    path: 'mes-appartements',
    canActivate: [DashboardGuard],
    loadComponent: () => import('./features/proprietaire/mes-appartements/mes-appartements.component').then(m => m.MesAppartementsComponent),
    data: { role: 'PROPRIETAIRE' }
  },
  {
    path: 'mes-paiements',
    canActivate: [DashboardGuard],
    loadComponent: () => import('./features/proprietaire/mes-paiements/mes-paiements.component').then(m => m.MesPaiementsComponent),
    data: { role: 'PROPRIETAIRE' }
  },
  {
    path: 'mes-documents',
    canActivate: [DashboardGuard],
    loadComponent: () => import('./features/proprietaire/mes-documents/mes-documents.component').then(m => m.MesDocumentsComponent),
    data: { role: 'PROPRIETAIRE' }
  },
  {
    path: 'profile',
    canActivate: [DashboardGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
