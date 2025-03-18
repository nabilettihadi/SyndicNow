import { Appartement } from './appartement.model';

export interface Locataire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateDebut: Date;
  dateFin?: Date;
  appartement?: Appartement;
  statut?: 'ACTIF' | 'INACTIF';
} 