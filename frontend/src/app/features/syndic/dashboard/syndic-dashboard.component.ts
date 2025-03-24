import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { SyndicService } from '@core/services/syndic.service';
import { ImmeubleService } from '@core/services/immeuble.service';
import { PaiementService } from '@core/services/paiement.service';
import { IncidentService } from '@core/services/incident.service';
import { Immeuble } from '@core/models/immeuble.model';
import { Paiement } from '@core/models/paiement.model';
import { Incident, IncidentWithStatus } from '@core/models/incident.model';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-syndic-dashboard',
  standalone: true,
  imports: [CommonModule, FooterComponent, RouterModule, FormsModule],
  templateUrl: './syndic-dashboard.component.html'
})
export class SyndicDashboardComponent implements OnInit {
  syndicId: number = 1; // À remplacer par l'ID du syndic actuel
  isLoading = true;
  hasError = false;
  errorMessage = '';
  
  // Statistiques
  totalBuildings: number = 0;
  activeBuildings: number = 0;
  pendingPayments: number = 0;
  totalRevenue: number = 0;
  
  // Données
  immeubles: Immeuble[] = [];
  paiements: Paiement[] = [];
  incidents: IncidentWithStatus[] = [];
  
  // Filtres
  searchTerm: string = '';
  filteredBuildings: Immeuble[] = [];

  // États de chargement
  loadingBuildings = false;
  loadingPayments = false;
  loadingIncidents = false;

  // Données pour les statistiques
  paiementStatusData: {name: string, value: number}[] = [];
  incidentPriorityData: {name: string, value: number}[] = [];
  revenueByMonthData: {name: string, value: number}[] = [];
  occupationData: {name: string, value: number}[] = [];

  constructor(
    private syndicService: SyndicService,
    private immeubleService: ImmeubleService,
    private paiementService: PaiementService,
    private incidentService: IncidentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID syndic depuis le service d'authentification
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.userId) {
      this.syndicId = currentUser.userId;
    }
    
    this.loadData();
  }

  private loadData(): void {
    this.loadingBuildings = true;
    this.loadingPayments = true;
    this.loadingIncidents = true;
    this.errorMessage = '';
    
    forkJoin({
      immeubles: this.loadBuildings(),
      paiements: this.loadPayments(),
      incidents: this.loadIncidents()
    }).subscribe({
      next: (results) => {
        this.immeubles = results.immeubles;
        this.filteredBuildings = [...results.immeubles];
        this.paiements = results.paiements;
        this.incidents = results.incidents;
        this.calculateStatistics();
        this.prepareChartData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Une erreur est survenue lors du chargement des données';
      }
    });
  }

  private loadBuildings(): Observable<Immeuble[]> {
    return this.immeubleService.getImmeublesBySyndic(this.syndicId).pipe(
      map(immeubles => {
        this.immeubles = immeubles;
        this.filteredBuildings = [...immeubles];
        return immeubles;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des immeubles:', error);
        return of([]);
      })
    );
  }

  private loadPayments(): Observable<Paiement[]> {
    return this.paiementService.getPaiementsBySyndic(this.syndicId).pipe(
      map(paiements => {
        this.paiements = paiements;
        return paiements;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des paiements:', error);
        return of([]);
      })
    );
  }

  private loadIncidents(): Observable<IncidentWithStatus[]> {
    return this.incidentService.getIncidentsBySyndic(this.syndicId).pipe(
      map(incidents => {
        this.incidents = incidents;
        return incidents;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des incidents:', error);
        return of([]);
      })
    );
  }

  private calculateStatistics(): void {
    // Calculer les statistiques des immeubles
    this.totalBuildings = this.immeubles.length;
    this.activeBuildings = this.immeubles.filter(immeuble => immeuble.status === 'ACTIF').length;

    // Calculer les statistiques des paiements
    this.pendingPayments = this.paiements.filter(paiement => paiement.status === 'EN_ATTENTE').length;
    this.totalRevenue = this.paiements
      .filter(paiement => paiement.status === 'PAYE')
      .reduce((total, paiement) => total + paiement.montant, 0);
  }

  prepareChartData(): void {
    // Données pour le graphique des statuts de paiement
    const paymentStatusCounts = this.countByProperty(this.paiements, 'status');
    this.paiementStatusData = Object.keys(paymentStatusCounts).map(status => {
      return {
        name: this.formatStatus(status),
        value: paymentStatusCounts[status]
      };
    });

    // Données pour le graphique des priorités d'incidents
    const incidentPriorityCounts = this.countByProperty(this.incidents, 'priority');
    this.incidentPriorityData = Object.keys(incidentPriorityCounts).map(priority => {
      return {
        name: this.formatPriority(priority),
        value: incidentPriorityCounts[priority]
      };
    });

    // Données pour le graphique des revenus par mois
    this.revenueByMonthData = this.calculateRevenueByMonth();

    // Données pour le graphique d'occupation
    this.occupationData = this.calculateOccupationRate();
  }

  private countByProperty(array: any[], property: string): Record<string, number> {
    return array.reduce((acc, item) => {
      const key = item[property];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  private formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'PAYE': 'Payé',
      'EN_ATTENTE': 'En attente',
      'ANNULÉ': 'Annulé',
      'RETARD': 'En retard'
    };
    return statusMap[status] || status;
  }

  private formatPriority(priority: string): string {
    const priorityMap: Record<string, string> = {
      'HAUTE': 'Haute',
      'MOYENNE': 'Moyenne',
      'BASSE': 'Basse'
    };
    return priorityMap[priority] || priority;
  }

  private calculateRevenueByMonth(): any[] {
    const monthlyRevenue: Record<string, number> = {};
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
    
    // Initialiser tous les mois à 0
    months.forEach((month, index) => {
      monthlyRevenue[month] = 0;
    });
    
    // Calculer les revenus par mois
    this.paiements
      .filter(p => p.status === 'PAYE' && p.datePaiement)
      .forEach(payment => {
        const date = new Date(payment.datePaiement);
        const month = months[date.getMonth()];
        monthlyRevenue[month] += payment.montant;
      });
      
    return Object.keys(monthlyRevenue).map(month => {
      return {
        name: month,
        value: monthlyRevenue[month]
      };
    });
  }

  private calculateOccupationRate(): any[] {
    const occupationData = [
      { name: 'Occupés', value: 0 },
      { name: 'Vacants', value: 0 }
    ];
    
    // Calculer les taux d'occupation pour tous les immeubles
    let totalApartments = 0;
    let occupiedApartments = 0;
    
    this.immeubles.forEach(building => {
      // Utilisez nombreAppartements et appartmentsOccupes s'ils existent
      if (building.nombreAppartements) {
        totalApartments += building.nombreAppartements;
        occupiedApartments += building.appartmentsOccupes || 0;
      }
    });
    
    occupationData[0].value = occupiedApartments;
    occupationData[1].value = totalApartments - occupiedApartments;
    
    return occupationData;
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredBuildings = [...this.immeubles];
      return;
    }
    
    const searchLower = this.searchTerm.toLowerCase();
    this.filteredBuildings = this.immeubles.filter(immeuble => 
      immeuble.nom.toLowerCase().includes(searchLower) || 
      immeuble.adresse.toLowerCase().includes(searchLower) ||
      immeuble.ville.toLowerCase().includes(searchLower)
    );
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'ACTIF':
        return 'bg-green-100 text-green-800';
      case 'EN_CONSTRUCTION':
        return 'bg-blue-100 text-blue-800';
      case 'EN_MAINTENANCE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
} 