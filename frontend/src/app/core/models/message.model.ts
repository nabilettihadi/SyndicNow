export interface Message {
  id?: number;
  sujet: string;
  contenu: string;
  dateEnvoi: Date;
  statut: 'LU' | 'NON_LU';
  type: 'ANNONCE' | 'NOTIFICATION' | 'MESSAGE';
  expediteur: {
    id: number;
    nom: string;
    prenom: string;
    role: string;
  };
  destinataires: {
    id: number;
    nom: string;
    prenom: string;
    role: string;
  }[];
  immeuble?: {
    id: number;
    nom: string;
  };
  pieceJointe?: {
    id: number;
    nom: string;
    url: string;
  }[];
} 