export interface Immeuble {
  id: number;
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  nombreEtages: number;
  nombreAppartements: number;
  anneeConstruction: number;
  syndicId: number;
  description?: string;
  dateCreation: Date;
  dateModification: Date;
} 