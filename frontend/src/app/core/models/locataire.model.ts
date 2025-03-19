import { Appartement } from './appartement.model';

export interface Locataire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: Date;
  dateEntree: Date;
  dateSortie?: Date;
  status: 'ACTIF' | 'INACTIF';
  appartementId: number;
  appartement?: {
    id: number;
    numero: string;
    immeuble: {
      id: number;
      nom: string;
    };
  };
}

export interface LocataireStats {
  total: number;
  parStatus: {
    [key: string]: number;
  };
  parImmeuble: {
    [key: string]: number;
  };
  nouveauxLocatairesParMois: {
    [key: string]: number;
  };
} 