export type PaiementType = 'CHARGES' | 'TRAVAUX' | 'AUTRES';
export type PaiementStatus = 'PAYE' | 'EN_ATTENTE' | 'EN_RETARD' | 'ANNULE';
export type MethodePaiement = 'CARTE' | 'VIREMENT' | 'CHEQUE' | 'ESPECES';

export interface IPaiement {
  id: number;
  date: string;
  dateEcheance: string;
  montant: number;
  type: PaiementType;
  status: PaiementStatus;
  methodePaiement: MethodePaiement;
  description?: string;
  proprietaireId: number;
  immeubleId: number;
}

export interface PaiementStats {
  prochainPaiement: IPaiement | null;
  totalPaye: number;
  nombrePaiements: number;
  etatPaiements: 'A_JOUR' | 'EN_RETARD';
  paiementsEnRetard: number;
} 