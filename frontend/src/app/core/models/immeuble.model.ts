export interface Immeuble {
  id: number;
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  dateConstruction?: Date;
  anneeConstruction?: number;
  nombreEtages: number;
  nombreAppartements: number;
  appartmentsOccupes?: number;
  syndicId: number;
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
  description?: string;
  dateCreation?: Date;
  dateModification?: Date;
}

export interface ImmeubleStats {
  total: number;
  parVille: {
    [key: string]: number;
  };
  nombreEtagesMoyen: number;
  nombreAppartementsMoyen: number;
} 