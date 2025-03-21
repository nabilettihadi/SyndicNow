import { Routes } from '@angular/router';
import { ImmeublesComponent } from './immeubles.component';
import { ListImmeublesComponent } from './list-immeubles/list-immeubles.component';
import { ImmeubleDetailsComponent } from './immeuble-details/immeuble-details.component';

export const IMMEUBLES_ROUTES: Routes = [
  {
    path: '',
    component: ImmeublesComponent,
    children: [
      {
        path: '',
        component: ListImmeublesComponent,
      },
      {
        path: ':id',
        component: ImmeubleDetailsComponent,
      }
      // Les routes pour add et edit seront ajoutées ultérieurement
    ],
  },
]; 