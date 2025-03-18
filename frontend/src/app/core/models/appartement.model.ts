export interface Appartement {
  id?: number;
  numero: string;
  etage: number;
  superficie: number;
  nombrePieces: number;
  statut: 'OCCUPE' | 'LIBRE' | 'EN_TRAVAUX';
  immeuble: {
    id: number;
    nom: string;
  };
  proprietaire: {
    id: number;
    nom: string;
    prenom: string;
  };
  locataireActuel?: {
    id: number;
    nom: string;
    prenom: string;
  };
} 