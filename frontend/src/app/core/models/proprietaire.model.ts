export interface Proprietaire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
  ville?: string;
  dateCreation: Date;
  appartements?: any[];
  status: 'ACTIF' | 'INACTIF';
}

export interface ProprietaireStats {
  totalProprietaires: number;
  proprietaireParVille: { [key: string]: number };
  proprietaireParImmeuble: { [key: string]: number };
  nouveauxProprietairesParMois: { [key: string]: number };
} 