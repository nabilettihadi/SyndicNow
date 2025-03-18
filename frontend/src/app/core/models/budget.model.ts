export interface Budget {
  id?: number;
  annee: number;
  montantTotal: number;
  montantDepense: number;
  montantRestant: number;
  statut: 'EN_COURS' | 'CLOTURE';
  dateCreation: Date;
  dateModification?: Date;
  immeuble: {
    id: number;
    nom: string;
  };
  categories: {
    id: number;
    nom: string;
    montantAlloue: number;
    montantDepense: number;
    description?: string;
  }[];
  depenses: {
    id: number;
    description: string;
    montant: number;
    date: Date;
    categorie: string;
    justificatif?: string;
  }[];
  commentaires?: string;
} 