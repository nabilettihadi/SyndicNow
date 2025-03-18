export interface Document {
  id?: number;
  nom: string;
  description: string;
  type: 'CONTRAT' | 'FACTURE' | 'REGLEMENT' | 'AUTRE';
  dateCreation: Date;
  dateModification?: Date;
  url: string;
  taille: number;
  format: string;
  creePar: {
    id: number;
    nom: string;
    prenom: string;
    role: string;
  };
  immeuble?: {
    id: number;
    nom: string;
  };
  appartement?: {
    id: number;
    numero: string;
  };
  tags?: string[];
} 