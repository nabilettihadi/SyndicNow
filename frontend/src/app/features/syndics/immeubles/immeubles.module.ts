import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {ImmeublesComponent} from './immeubles.component';
import {ImmeubleFormComponent} from './components/immeuble-form/immeuble-form.component';

const routes: Routes = [
  {path: '', component: ImmeublesComponent},
  {path: 'nouveau', component: ImmeubleFormComponent},
  {path: ':id/edit', component: ImmeubleFormComponent}
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    ImmeublesComponent,
    ImmeubleFormComponent
  ]
})
export class ImmeublesModule {
}
