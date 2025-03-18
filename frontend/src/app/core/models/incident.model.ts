export interface Incident {
  id?: number;
  titre: string;
  description: string;
  dateDeclaration: Date;
  dateResolution?: Date;
  statut: 'EN_COURS' | 'RESOLU' | 'EN_ATTENTE';
  priorite: 'HAUTE' | 'MOYENNE' | 'BASSE';
  type: 'TECHNIQUE' | 'SECURITE' | 'AUTRE';
  immeuble: {
    id: number;
    nom: string;
  };
  declarePar: {
    id: number;
    nom: string;
    prenom: string;
  };
} 