import { Routes } from '@angular/router';
import { ImmeublesComponent } from './immeubles.component';
import { ListImmeublesComponent } from './list-immeubles/list-immeubles.component';
import { ImmeubleDetailsComponent } from './immeuble-details/immeuble-details.component';
import { CreateImmeubleComponent } from './create-immeuble/create-immeuble.component';
import { EditImmeubleComponent } from './edit-immeuble/edit-immeuble.component';

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
        path: 'create',
        component: CreateImmeubleComponent,
      },
      {
        path: ':id/edit',
        component: EditImmeubleComponent,
      },
      {
        path: ':id',
        component: ImmeubleDetailsComponent,
      }
      // Les routes pour edit seront ajoutées ultérieurement
    ],
  },
]; 