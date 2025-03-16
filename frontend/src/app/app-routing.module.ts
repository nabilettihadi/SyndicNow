import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'proprietaire',
    loadChildren: () => import('./features/proprietaire/proprietaire.module').then(m => m.ProprietaireModule),
    canActivate: [AuthGuard],
    data: { roles: ['PROPRIETAIRE'] }
  },
  {
    path: 'syndic',
    loadChildren: () => import('./features/syndics/syndics.module').then(m => m.SyndicsModule),
    canActivate: [AuthGuard],
    data: { roles: ['SYNDIC'] }
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 