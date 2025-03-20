import { Appartement } from './appartement.model';

export interface Paiement {
  datePaiement: string | number | Date;
  id: number;
  reference: string;
  montant: number;
  date: Date;
  methode: string;
  status: 'EN_ATTENTE' | 'PAYE' | 'RETARDE' | 'ANNULE';
  type: 'LOYER' | 'CHARGES' | 'AUTRE';
  proprietaireId: number;
  immeubleId: number;
  appartementId: number;
  proprietaire?: {
    id: number;
    nom: string;
    prenom: string;
  };
  immeuble?: {
    id: number;
    nom: string;
  };
  appartement?: {
    id: number;
    numero: string;
  };
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

export interface PaiementStats {
  total: number;
  parStatus: {
    [key: string]: number;
  };
  parType: {
    [key: string]: number;
  };
  parImmeuble: {
    [key: string]: number;
  };
  montantTotal: number;
  montantMoyen: number;
} 