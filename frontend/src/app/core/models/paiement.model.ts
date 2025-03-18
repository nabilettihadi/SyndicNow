import { Appartement } from './appartement.model';

export interface Locataire {
  id: number;
  nom: string;
  prenom: string;
  appartement?: Appartement;
}

export interface Paiement {
  id: number;
  reference: string;
  montant: number;
  datePaiement: Date;
  dateEcheance: string;
  statut: string;
  status?: string; // Pour la rétrocompatibilité
  type?: string;
  date?: string;
  locataire: Locataire;
  appartement?: Appartement;
  methodePaiement: string;
  description?: string;
  proprietaireId?: number;
  immeubleId?: number;
}

export interface IPaiement extends Paiement {} // Pour la rétrocompatibilité

export interface PaiementStatistics {
  totalPaiements: number;
  paiementsEnAttente: number;
  paiementsValides: number;
  paiementsRejetes: number;
  montantTotal: number;
  montantMoisCourant: number;
  parMois: { [key: string]: number };
} 