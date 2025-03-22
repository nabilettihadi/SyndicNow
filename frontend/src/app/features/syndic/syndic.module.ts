import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SYNDIC_ROUTES } from './syndic.routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(SYNDIC_ROUTES)
  ]
})
export class SyndicModule { } 