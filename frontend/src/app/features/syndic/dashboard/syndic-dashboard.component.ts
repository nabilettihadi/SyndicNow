import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {catchError, forkJoin, map, Observable, of} from 'rxjs';
import {FooterComponent} from '@shared/components/footer/footer.component';
import {SyndicService} from '@core/services/syndic.service';
import {ImmeubleService} from '@core/services/immeuble.service';
import {IncidentService} from '@core/services/incident.service';
import {Immeuble} from '@core/models/immeuble.model';
import {Incident} from '@core/models/incident.model';
import {AuthService} from '@core/services/auth.service';

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
  isLoadingImmeubles = false;

  // Statistiques
  totalBuildings: number = 0;
  activeBuildings: number = 0;
  totalIncidents: number = 0;
  incidentsEnCours: number = 0;
  incidentsResolus: number = 0;

  // Données
  immeubles: Immeuble[] = [];
  incidents: Incident[] = [];

  // Filtres
  searchTerm: string = '';
  filteredBuildings: Immeuble[] = [];

  // États de chargement
  loadingBuildings = false;
  loadingIncidents = false;

  // Données pour les statistiques
  buildingStatusData: { name: string, value: number }[] = [];
  incidentPriorityData: { name: string, value: number }[] = [];
  incidentStatusData: { name: string, value: number }[] = [];
  occupationData: { name: string, value: number }[] = [];

  constructor(
    private syndicService: SyndicService,
    private immeubleService: ImmeubleService,
    private incidentService: IncidentService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    // Récupérer l'ID syndic depuis le service d'authentification
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.userId) {
      this.syndicId = currentUser.userId;
    }

    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loadingBuildings = true;
    this.loadingIncidents = true;
    this.errorMessage = '';

    forkJoin({
      immeubles: this.loadBuildings(),
      incidents: this.loadIncidents()
    }).subscribe({
      next: (results) => {
        this.immeubles = results.immeubles;
        this.filteredBuildings = [...results.immeubles];
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

  private loadIncidents(): Observable<Incident[]> {
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

    // Calculer les statistiques des incidents
    this.totalIncidents = this.incidents.length;
    this.incidentsEnCours = this.incidents.filter(i => i.status === 'EN_COURS').length;
    this.incidentsResolus = this.incidents.filter(i => i.status === 'RESOLU').length;
  }

  prepareChartData(): void {
    // Données pour le graphique des statuts d'immeubles
    const buildingStatusCounts = this.countByProperty(this.immeubles, 'status');
    this.buildingStatusData = Object.keys(buildingStatusCounts).map(status => {
      return {
        name: this.formatStatus(status),
        value: buildingStatusCounts[status]
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

    // Données pour le graphique des statuts d'incidents
    const incidentStatusCounts = this.countByProperty(this.incidents, 'status');
    this.incidentStatusData = Object.keys(incidentStatusCounts).map(status => {
      return {
        name: this.formatIncidentStatus(status),
        value: incidentStatusCounts[status]
      };
    });

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
      'ACTIF': 'Actif',
      'EN_CONSTRUCTION': 'En construction',
      'EN_MAINTENANCE': 'En maintenance',
      'EN_ATTENTE': 'En attente',
      'ANNULÉ': 'Annulé'
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

  private formatIncidentStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'EN_COURS': 'En cours',
      'RESOLU': 'Résolu',
      'EN_ATTENTE': 'En attente',
      'ANNULÉ': 'Annulé'
    };
    return statusMap[status] || status;
  }

  private calculateOccupationRate(): any[] {
    const occupationData = [
      {name: 'Occupés', value: 0},
      {name: 'Vacants', value: 0}
    ];

    let totalApartments = 0;
    let occupiedApartments = 0;

    this.immeubles.forEach(immeuble => {
      if (immeuble.nombreAppartements) {
        totalApartments += immeuble.nombreAppartements;
        occupiedApartments += immeuble.appartmentsOccupes || 0;
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

  loadImmeubles(): void {
    this.isLoadingImmeubles = true;
    this.immeubleService.getAllImmeublesBySyndic().subscribe({
      next: (data) => {
        this.immeubles = data;
        this.totalBuildings = this.immeubles.length;
        this.activeBuildings = this.totalBuildings; // Tous les immeubles sont considérés comme actifs
        this.isLoadingImmeubles = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des immeubles:', error);
        this.isLoadingImmeubles = false;
      }
    });
  }
}
