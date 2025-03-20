export interface Incident {
  id: number;
  titre: string;
  description: string;
  priorite: 'HAUTE' | 'MOYENNE' | 'BASSE';
  statut: 'NOUVEAU' | 'EN_COURS' | 'RESOLU';
  dateCreation: Date;
  date?: Date; // Alias pour la compatibilité avec les templates
  rapporteur: string;
  immeubleId: number;
  immeuble?: {
    id: number;
    nom: string;
  };
}

// Interface étendue qui ajoute la propriété status comme alias de statut
export interface IncidentWithStatus extends Incident {
  status: 'NOUVEAU' | 'EN_COURS' | 'RESOLU';
}

// Cette fonction convertit un Incident en IncidentWithStatus
export function addStatusAlias(incident: Incident): IncidentWithStatus {
  const incidentWithStatus = incident as IncidentWithStatus;
  Object.defineProperty(incidentWithStatus, 'status', {
    get: function() { return this.statut; },
    set: function(value) { this.statut = value; },
    enumerable: true
  });
  // Ajouter également la propriété date si elle n'existe pas
  if (!incidentWithStatus.date) {
    incidentWithStatus.date = incidentWithStatus.dateCreation;
  }
  return incidentWithStatus;
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