export interface Incident {
  id?: number;
  title: string;
  description: string;
  priority: 'HAUTE' | 'MOYENNE' | 'BASSE';
  status: 'NOUVEAU' | 'EN_COURS' | 'RESOLU';
  reportedDate?: Date;
  immeubleId: number;
  appartementId: number;
  category: 'PLOMBERIE' | 'ELECTRICITE' | 'CHAUFFAGE' | 'CLIMATISATION' | 'ASCENSEUR' | 'SERRURERIE' | 'TOITURE' | 'PARTIES_COMMUNES' | 'INFILTRATION' | 'AUTRE';
  immeuble?: {
    id: number;
    nom: string;
  };
}

// Interface étendue qui ajoute la propriété status comme alias de statut
export interface IncidentWithStatus extends Incident {
  statut: string;
  titre: string;
  priorite: string;
  categorie: string;
  date?: Date;
}

// Cette fonction convertit un Incident en IncidentWithStatus
export function addStatusAlias(incident: Incident): IncidentWithStatus {
  return {
    ...incident,
    statut: incident.status,
    titre: incident.title,
    priorite: incident.priority,
    categorie: incident.category,
    date: incident.reportedDate
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
