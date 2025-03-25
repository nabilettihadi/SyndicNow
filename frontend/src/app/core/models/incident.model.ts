export type IncidentCategory = 'PLOMBERIE' | 'TOITURE' | 'AUTRE' | 'CHAUFFAGE' | 'SERRURERIE' | 'ASCENSEUR' | 'CLIMATISATION' | 'ELECTRICITE' | 'PARTIES_COMMUNES' | 'INFILTRATION';

export interface Incident {
  id?: number;
  title: string;
  description: string;
  status: 'NOUVEAU' | 'EN_COURS' | 'RESOLU';
  priority: 'HAUTE' | 'MOYENNE' | 'BASSE';
  reportedDate: string;
  reportedBy: number;
  category: IncidentCategory;
  assignedTo?: number;
  resolutionDate?: string;
  resolution?: string;
  appartementId: number;
  immeubleId: number;
  attachmentUrls?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export type IncidentStatus = 'NOUVEAU' | 'EN_COURS' | 'RESOLU';

// Interface étendue qui ajoute la propriété status comme alias de statut
export interface IncidentWithStatus extends Incident {
  statut: IncidentStatus;
  priorite: string;
  titre: string;
  date: string;
  immeuble?: {
    nom: string;
  };
}

// Cette fonction convertit un Incident en IncidentWithStatus
export function addStatusAlias(incident: Incident): IncidentWithStatus {
  return {
    ...incident,
    statut: incident.status,
    priorite: incident.priority,
    titre: incident.title,
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
