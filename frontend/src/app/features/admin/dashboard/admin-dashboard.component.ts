import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SyndicService} from '@core/services/syndic.service';
import {ImmeubleService} from '@core/services/immeuble.service';
import {ProprietaireService} from '@core/services/proprietaire.service';

export interface DashboardStats {
  totalSyndics: number;
  totalProprietaires: number;
  totalImmeubles: number;
  totalAppartements: number;
  totalIncidents: number;
  totalPaiements: number;
  pendingPayments: number;
  revenue: number;
  paymentPercentage: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>

      <!-- Statistiques générales -->
      <app-dashboard-stats [stats]="stats" [isLoading]="isLoading"></app-dashboard-stats>

      <!-- Syndics récents -->
      <app-recent-syndics [syndics]="recentSyndics" [isLoading]="isLoading"></app-recent-syndics>

      <!-- Sections inférieures -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Immeubles par ville -->
        <app-immeubles-par-ville
          [immeublesParVille]="immeublesParVille"
          [totalImmeubles]="stats.totalImmeubles"
          [isLoading]="isLoading">
        </app-immeubles-par-ville>

        <!-- Statistiques des paiements -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4">Statistiques des paiements</h2>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Paiements en attente</span>
                <span class="font-medium">{{ stats.pendingPayments }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Montant total</span>
                <span class="font-medium">{{ stats.revenue | currency:'EUR' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Taux de paiement</span>
                <span class="font-medium">{{ stats.paymentPercentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalSyndics: 0,
    totalProprietaires: 0,
    totalImmeubles: 0,
    totalAppartements: 0,
    totalIncidents: 0,
    totalPaiements: 0,
    pendingPayments: 0,
    revenue: 0,
    paymentPercentage: 0
  };
  recentSyndics: any[] = [];
  immeublesParVille: { ville: string; count: number }[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private syndicService: SyndicService,
    private immeubleService: ImmeubleService,
    private proprietaireService: ProprietaireService
  ) {
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    // Charger les données du dashboard
    this.loadSyndics();
    this.loadImmeubles();
    this.loadProprietaires();
  }

  loadSyndics(): void {
    this.syndicService.getAllSyndics().subscribe({
      next: (data) => {
        const syndics = Array.isArray(data) ? data : [];
        this.stats.totalSyndics = syndics.length;
        this.recentSyndics = syndics.slice(0, 5);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des syndics:', error);
        this.error = 'Une erreur est survenue lors du chargement des syndics';
        this.isLoading = false;
      }
    });
  }

  loadImmeubles(): void {
    this.immeubleService.getAllImmeubles().subscribe({
      next: (data) => {
        const immeubles = Array.isArray(data) ? data : [];
        this.stats.totalImmeubles = immeubles.length;
        this.calculateImmeublesParVille(immeubles);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des immeubles:', error);
        this.error = 'Une erreur est survenue lors du chargement des immeubles';
        this.isLoading = false;
      }
    });
  }

  loadProprietaires(): void {
    this.proprietaireService.getAllProprietaires().subscribe({
      next: (data) => {
        const proprietaires = Array.isArray(data) ? data : [];
        this.stats.totalProprietaires = proprietaires.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des propriétaires:', error);
        this.error = 'Une erreur est survenue lors du chargement des propriétaires';
        this.isLoading = false;
      }
    });
  }

  calculateImmeublesParVille(immeubles: any[]): void {
    const villeCounts = new Map<string, number>();
    immeubles.forEach(immeuble => {
      const count = villeCounts.get(immeuble.ville) || 0;
      villeCounts.set(immeuble.ville, count + 1);
    });

    this.immeublesParVille = Array.from(villeCounts.entries())
      .map(([ville, count]) => ({ville, count}))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}
