import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ImmeublesModule} from './immeubles/immeubles.module';
import {PaiementsComponent} from './paiements/paiements.component';

const routes: Routes = [
  {
    path: 'immeubles',
    loadChildren: () => import('./immeubles/immeubles.module').then(m => m.ImmeublesModule)
  },
  {
    path: 'paiements',
    component: PaiementsComponent
  },
  {
    path: 'charges',
    loadComponent: () => import('./charges/charges.component').then(m => m.ChargesComponent)
  }
];

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ImmeublesModule,
    RouterModule.forChild(routes),
    PaiementsComponent
  ],
  exports: [
    RouterModule
  ]
})
export class SyndicsModule {
}
