export interface Locataire {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateDebut: Date;
  dateFin?: Date;
  appartement: {
    id: number;
    numero: string;
    etage: number;
  };
} 