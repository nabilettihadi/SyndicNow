export interface Paiement {
  id: number;
  date: string;
  montant: number;
  type: string;
  status: string;
  methodePaiement: string;
  dateEcheance: string;
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