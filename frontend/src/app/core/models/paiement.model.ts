export interface Paiement {
  id: number;
  montant: number;
  datePaiement: Date;
  status: 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
  proprietaireId: number;
  appartementId: number;
  moisConcerne: string;
  anneeConcerne: number;
  methodePaiement: string;
  reference?: string;
}

export interface PaiementStatistics {
  totalPaiements: number;
  paiementsEnAttente: number;
  paiementsValides: number;
  paiementsRejetes: number;
  montantTotal: number;
  montantMoisCourant: number;
  parMois: { [key: string]: number };
} 