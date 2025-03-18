export interface Syndic {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateDebut: Date;
  dateFin?: Date;
  statut: 'ACTIF' | 'INACTIF';
  specialite?: string;
  immeubles: {
    id: number;
    nom: string;
    adresse: string;
  }[];
  documents?: {
    id: number;
    nom: string;
    type: string;
    url: string;
  }[];
} 