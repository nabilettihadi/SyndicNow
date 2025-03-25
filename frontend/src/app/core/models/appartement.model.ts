export interface Appartement {
  id: number;
  numero: string;
  etage: number;
  surface: number;
  nombrePieces: number;
  description?: string;
  status?: 'OCCUPE' | 'LIBRE' | 'EN_TRAVAUX';
  immeubleId: number;
  immeuble?: {
    id: number;
    nom: string;
    adresse: string;
    ville: string;
    syndic?: {
      id: number;
      nom: string;
      email: string;
      telephone: string;
      ville: string;
      status: 'ACTIF' | 'INACTIF' | 'EN_ATTENTE';
      dateCreation: Date;
      immeubles: any[];
      nombreImmeubles?: number;
      adresse?: string;
    };
  };
}

export interface AppartementRequest {
  numero: string;
  etage: number;
  surface: number;
  nombrePieces: number;
  description?: string;
  immeubleId: number;
  proprietaireIds?: number[];
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