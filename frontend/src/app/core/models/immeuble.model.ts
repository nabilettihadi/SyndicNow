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
  status: 'ACTIF' | 'EN_TRAVAUX' | 'INACTIF';
  syndicId: number;
  syndic?: {
    id: number;
    nom: string;
  };
  description?: string;
  dateCreation?: Date;
  dateModification?: Date;
}

export interface ImmeubleStats {
  total: number;
  parStatus: {
    [key: string]: number;
  };
  parVille: {
    [key: string]: number;
  };
  nombreAppartementsMoyen: number;
  nombreEtagesMoyen: number;
} 