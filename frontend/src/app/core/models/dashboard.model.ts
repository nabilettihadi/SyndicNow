import { Immeuble, ImmeubleStatistics } from './immeuble.model';
import { Paiement, PaiementStatistics } from './paiement.model';
import { Proprietaire, ProprietaireStatistics } from './proprietaire.model';

export interface DashboardStats {
  // Propriétés de base
  immeubles?: Immeuble[];
  paiements?: Paiement[];
  paiementsStats?: PaiementStatistics;
  proprietaires?: Proprietaire[];
  proprietairesStats?: ProprietaireStatistics;
  paiementsRecents?: Paiement[];
  mesPaiements?: Paiement[];
  mesAppartements?: Proprietaire;

  // Statistiques générales
  syndicsCount?: number;
  newSyndicsThisMonth?: number;
  totalBuildings?: number;
  activeBuildings?: number;
  revenue?: number;
  revenueGrowth?: number;
  buildingsCount?: number;
  newBuildingsThisMonth?: number;
  ownersCount?: number;
  newOwnersThisMonth?: number;
  
  // Statistiques de paiement
  monthlyPayments?: number;
  paymentPercentage?: number;
  apartmentsCount?: number;
  pendingPayments?: number;
  nextPaymentDue?: string;
  totalPaid?: number;
  lastPaymentDate?: string;
  
  // Statistiques des syndics
  activeSyndics?: number;
  pendingSyndics?: number;
  
  // Statistiques des rapports
  reportsCount?: number;
  monthlyReports?: number;
  
  // Statistiques des immeubles
  buildingsInMaintenance?: number;
  
  // Statistiques financières
  pendingAmount?: number;
  latePayments?: number;
  
  // Statistiques des appartements
  totalArea?: number;
  amountDue?: number;
  nextDueDate?: string;

  // Statistiques détaillées
  statistiques: {
    totalImmeubles?: ImmeubleStatistics;
    totalPaiements?: PaiementStatistics;
    totalProprietaires?: ProprietaireStatistics;
    totalAppartements?: ImmeubleStatistics;
    paiementsEnAttente?: PaiementStatistics;
    prochainsDelais?: PaiementStatistics;
  };
} 