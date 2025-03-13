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

export const routes: Routes = [
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

  // Dashboard et routes protégées
  {
    path: '',
    canActivate: [RequireAuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'immeubles',
        loadChildren: () => import('./features/immeubles/immeubles.module').then(m => m.ImmeublesModule),
        data: { role: 'SYNDIC' }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Route fallback
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
