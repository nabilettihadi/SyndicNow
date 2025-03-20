export interface Syndic {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  status: 'ACTIF' | 'INACTIF' | 'EN_ATTENTE';
  dateCreation: Date;
  immeubles: any[];
}

export interface SyndicStats {
  totalSyndics: number;
  syndicActifs: number;
  syndicInactifs: number;
  syndicParVille: { [key: string]: number };
  nouveauxSyndicsParMois: { [key: string]: number };
} 