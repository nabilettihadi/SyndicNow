export interface Appartement {
  id: number;
  numero: string;
  etage: number;
  surface: number;
  loyer: number;
  statut: 'LIBRE' | 'OCCUPE' | 'EN_TRAVAUX';
  description?: string;
  caracteristiques: {
    nbChambres: number;
    nbSallesDeBain: number;
    balcon: boolean;
    parking: boolean;
    meuble: boolean;
  };
  locataireActuel?: {
    id: number;
    nom: string;
    prenom: string;
  };
} 