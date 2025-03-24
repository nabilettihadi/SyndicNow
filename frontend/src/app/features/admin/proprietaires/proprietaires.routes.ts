import {Routes} from '@angular/router';
import {ProprietairesComponent} from './proprietaires.component';
import {ListProprietairesComponent} from './components/list/list-proprietaires.component';
import {DetailProprietaireComponent} from './components/detail/detail-proprietaire.component';

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
    ],
  },
];
