export interface Proprietaire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  cin: string;
  dateInscription: Date;
  appartements?: number[];
}

export interface ProprietaireStatistics {
  totalProprietaires: number;
  nouveauxCeMois: number;
  proprietairesActifs: number;
  parImmeuble: { [key: string]: number };
  tauxPaiementMoyen: number;
} 