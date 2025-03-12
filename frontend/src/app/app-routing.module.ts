import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'buildings',
        loadChildren: () => import('./features/buildings/buildings.module').then(m => m.BuildingsModule),
        data: { role: 'SYNDIC' }
      },
      {
        path: 'my-properties',
        loadChildren: () => import('./features/properties/properties.module').then(m => m.PropertiesModule),
        data: { role: 'PROPRIETAIRE' }
      },
      {
        path: 'payments',
        loadChildren: () => import('./features/payments/payments.module').then(m => m.PaymentsModule)
      },
      {
        path: 'documents',
        loadChildren: () => import('./features/documents/documents.module').then(m => m.DocumentsModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 