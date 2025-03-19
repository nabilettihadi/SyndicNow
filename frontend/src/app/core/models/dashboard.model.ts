import {Immeuble, ImmeubleStats} from './immeuble.model';
import {Paiement, PaiementStatistics} from './paiement.model';
import {Syndic} from './syndic.model';
import {Proprietaire, ProprietaireStats} from './proprietaire.model';

export interface DashboardStats {
  // Propriétés de base
  immeubles?: Immeuble[];
  paiements?: Paiement[];
  paiementsStats?: PaiementStatistics;
  proprietaires?: Proprietaire[];
  proprietairesStats?: ProprietaireStats;
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
    totalImmeubles?: ImmeubleStats;
    totalPaiements?: PaiementStatistics;
    totalProprietaires?: ProprietaireStats;
    totalAppartements?: ImmeubleStats;
    paiementsEnAttente?: PaiementStatistics;
    prochainsDelais?: PaiementStatistics;
  };

  // Statistiques des incidents
  incidents?: number;
}

export interface DashboardData {
  syndics: Syndic[];
  immeubles: Immeuble[];
  proprietaires: Proprietaire[];
  stats: {
    totalSyndics: number;
    totalImmeubles: number;
    totalProprietaires: number;
    immeubleStats: ImmeubleStats;
    proprietaireStats: ProprietaireStats;
  };
}
