export interface Immeuble {
  id: number;
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  dateConstruction: Date;
  nombreEtages: number;
  nombreAppartements: number;
  status: 'ACTIF' | 'EN_TRAVAUX' | 'INACTIF';
  syndicId: number;
  syndic?: {
    id: number;
    nom: string;
  };
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