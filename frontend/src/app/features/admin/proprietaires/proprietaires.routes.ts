import { Routes } from '@angular/router';
import { ProprietairesComponent } from './proprietaires.component';
import { ListProprietairesComponent } from './list-proprietaires.component';

export const PROPRIETAIRES_ROUTES: Routes = [
  {
    path: '',
    component: ProprietairesComponent,
    children: [
      {
        path: '',
        component: ListProprietairesComponent,
      },
      // Les routes pour add et edit seront ajoutées ultérieurement
    ],
  },
]; 