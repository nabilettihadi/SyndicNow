export interface Appartement {
  id: number;
  numero: string;
  etage: number;
  surface: number;
  superficie: number;
  nombrePieces: number;
  description?: string;
  status: 'OCCUPE' | 'LIBRE' | 'EN_TRAVAUX';
  immeubleId: number;
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

export interface AppartementDetails extends Appartement {
  proprietaire?: {
    id: number;
    nom: string;
    prenom: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
} 