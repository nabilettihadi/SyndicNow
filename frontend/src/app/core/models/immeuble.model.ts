export interface Immeuble {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  region: string;
  nombreEtages: number;
  nombreAppartements: number;
  dateConstruction: Date;
  syndic?: number;
}

export interface ImmeubleStatistics {
  totalImmeubles: number;
  totalAppartements: number;
  parRegion: { [key: string]: number };
  tauxOccupation: number;
} 