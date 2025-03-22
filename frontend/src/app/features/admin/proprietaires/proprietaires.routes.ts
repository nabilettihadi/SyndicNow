import { Routes } from '@angular/router';
import { ProprietairesComponent } from './proprietaires.component';
import { ListProprietairesComponent } from './list-proprietaires.component';
import { DetailProprietaireComponent } from './detail-proprietaire/detail-proprietaire.component';

export const PROPRIETAIRES_ROUTES: Routes = [
  {
    path: '',
    component: ProprietairesComponent,
    children: [
      {
        path: '',
        component: ListProprietairesComponent,
      },
      {
        path: ':id',
        component: DetailProprietaireComponent
      },
      // Les routes pour add et edit seront ajoutées ultérieurement
    ],
  },
]; 