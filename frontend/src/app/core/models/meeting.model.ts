export interface Meeting {
  id?: number;
  titre: string;
  description: string;
  date: Date;
  heure: string;
  lieu: string;
  statut: 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';
  type: 'ORDINAIRE' | 'EXTRAORDINAIRE';
  immeuble: {
    id: number;
    nom: string;
  };
  participants?: {
    id: number;
    nom: string;
    prenom: string;
  }[];
  compteRendu?: string;
} 