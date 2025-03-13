import { Routes } from '@angular/router';
import { RequireAuthGuard } from './core/guards/require-auth.guard';
import { AuthGuard } from './features/auth/guards/auth.guard';

// Composant Home
import { HomeComponent } from './features/home/home.component';

// Composants d'authentification
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';

// Composant Dashboard
import { DashboardComponent } from './features/dashboard/dashboard.component';

// Composants Admin
import { UserManagementComponent } from './features/admin/components/user-management/user-management.component';
import { SettingsComponent } from './features/admin/components/settings/settings.component';

// Composants Syndic
import { ImmeublesComponent } from './features/syndic/components/immeubles/immeubles.component';
import { ChargesComponent } from './features/syndic/components/charges/charges.component';
import { DocumentsComponent as SyndicDocumentsComponent } from './features/syndic/components/documents/documents.component';

// Composants Propriétaire
import { AppartementsComponent } from './features/proprietaire/components/appartements/appartements.component';
import { PaiementsComponent } from './features/proprietaire/components/paiements/paiements.component';
import { DocumentsComponent as ProprietaireDocumentsComponent } from './features/proprietaire/components/documents/documents.component';

export const routes: Routes = [
  // Route par défaut vers Home
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },

  // Routes d'authentification
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // Dashboard (accessible à tous les utilisateurs authentifiés)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [RequireAuthGuard]
  },

  // Routes Admin
  {
    path: 'admin',
    canActivate: [RequireAuthGuard],
    children: [
      {
        path: 'users',
        component: UserManagementComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      }
    ]
  },

  // Routes Syndic
  {
    path: 'syndic',
    canActivate: [RequireAuthGuard],
    children: [
      {
        path: 'immeubles',
        component: ImmeublesComponent
      },
      {
        path: 'charges',
        component: ChargesComponent
      },
      {
        path: 'documents',
        component: SyndicDocumentsComponent
      },
      {
        path: '',
        redirectTo: 'immeubles',
        pathMatch: 'full'
      }
    ]
  },

  // Routes Propriétaire
  {
    path: 'proprietaire',
    canActivate: [RequireAuthGuard],
    children: [
      {
        path: 'appartements',
        component: AppartementsComponent
      },
      {
        path: 'paiements',
        component: PaiementsComponent
      },
      {
        path: 'documents',
        component: ProprietaireDocumentsComponent
      },
      {
        path: '',
        redirectTo: 'appartements',
        pathMatch: 'full'
      }
    ]
  },

  // Route fallback
  {
    path: '**',
    redirectTo: ''
  }
];
