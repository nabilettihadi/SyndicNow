export interface Immeuble {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  region: string;
  codePostal: string;
  nombreEtages: number;
  nombreAppartements: number;
  dateConstruction: Date;
  anneeConstruction: number;
  syndicId: number;
  description?: string;
  dateCreation: Date;
  dateModification: Date;
}

export interface ImmeubleStatistics {
  totalImmeubles: number;
  totalAppartements: number;
  parRegion: { [key: string]: number };
  tauxOccupation: number;
} 