export interface Incident {
  id: number;
  titre: string;
  description: string;
  priorite: 'HAUTE' | 'MOYENNE' | 'BASSE';
  statut: 'NOUVEAU' | 'EN_COURS' | 'RESOLU';
  dateCreation: Date;
  rapporteur: string;
  immeubleId: number;
  immeuble?: {
    id: number;
    nom: string;
  };
}

export interface IncidentStats {
  total: number;
  parStatut: {
    [key: string]: number;
  };
  parPriorite: {
    [key: string]: number;
  };
  parImmeuble: {
    [key: string]: number;
  };
} 