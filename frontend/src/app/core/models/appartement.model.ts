export interface Appartement {
  id: number;
  numero: string;
  etage: number;
  surface: number;
  superficie: number;
  nombrePieces: number;
  loyer: number;
  charges: number;
  status: 'OCCUPE' | 'LIBRE' | 'EN_TRAVAUX';
  immeubleId: number;
  proprietaireId?: number;
  dateCreation: Date;
  immeuble?: {
    id: number;
    nom: string;
    adresse: string;
    ville: string;
  };
}

export interface AppartementStats {
  totalAppartements: number;
  appartementParStatus: { [key: string]: number };
  appartementParImmeuble: { [key: string]: number };
  loyerMoyen: number;
  surfaceMoyenne: number;
}

export interface AppartementDetails {
  id: number;
  numero: string;
  etage: number;
  surface: number;
  nombrePieces: number;
  loyer: number;
  charges: number;
  status: 'OCCUPE' | 'LIBRE' | 'EN_TRAVAUX';
  immeubleId: number;
  proprietaireId?: number;
  dateCreation: Date;
  type: string;
  immeuble?: {
    id: number;
    nom: string;
    adresse: string;
  };
  proprietaire?: {
    id: number;
    nom: string;
    prenom: string;
  };
  caracteristiques: {
    nbChambres: number;
    nbSallesDeBain: number;
    balcon: boolean;
    parking: boolean;
    meuble: boolean;
  };
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 