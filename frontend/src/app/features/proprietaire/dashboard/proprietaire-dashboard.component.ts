import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {catchError, forkJoin, map, Observable, of, switchMap, tap} from 'rxjs';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {FooterComponent} from '@shared/components/footer/footer.component';
import {AppartementService} from '@core/services/appartement.service';
import {PaiementService} from '@core/services/paiement.service';
import {IncidentService} from '@core/services/incident.service';
import {Appartement} from '@core/models/appartement.model';
import {Paiement} from '@core/models/paiement.model';
import {IncidentWithStatus} from '@core/models/incident.model';
import {AuthService} from '@core/services/auth.service';

@Component({
  selector: 'app-proprietaire-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule, FormsModule],
  templateUrl: './proprietaire-dashboard.component.html',
  styles: []
})
export class ProprietaireDashboardComponent implements OnInit {
  userId: number = 0;
  lastLoginDate: Date = new Date();
  isLoading = true;
  hasError = false;
  errorMessage = '';

  // Statistiques
  totalAppartements: number = 0;
  occupiedAppartements: number = 0;
  freeAppartements: number = 0;
  totalRevenue: number = 0;

  // Données
  appartements: Appartement[] = [];
  paiements: Paiement[] = [];
  incidents: IncidentWithStatus[] = [];

  // Filtres
  searchTerm: string = '';
  filteredAppartements: Appartement[] = [];

  // Date actuelle pour calculs
  currentDate = new Date();

  constructor(
    private appartementService: AppartementService,
    private paiementService: PaiementService,
    private incidentService: IncidentService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    // Récupérer l'ID utilisateur authentifié
    this.authService.currentUser$.pipe(
      tap(user => {
        if (user) {
          this.userId = user.userId;
          this.lastLoginDate = new Date(); // Utiliser la date actuelle puisque lastLoginDate n'est pas disponible
        }
      }),
      switchMap(() => {
        if (!this.userId) {
          throw new Error('Utilisateur non authentifié');
        }

        // Charger toutes les données nécessaires en parallèle
        return forkJoin({
          appartements: this.loadAppartements(),
          paiements: this.loadPaiements(),
          incidents: this.loadIncidents()
        });
      })
    ).subscribe({
      next: () => {
        this.calculateStatistics();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = error.message || 'Une erreur est survenue lors du chargement des données';
      }
    });
  }

  loadAppartements(): Observable<Appartement[]> {
    return this.appartementService.getAppartementsByProprietaire(this.userId).pipe(
      map((data: Appartement[]) => {
        this.appartements = data;
        this.filteredAppartements = [...this.appartements];
        return data;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des appartements:', error);
        return of([]);
      })
    );
  }

  loadPaiements(): Observable<Paiement[]> {
    return this.paiementService.getPaiementsByProprietaire(this.userId).pipe(
      map((data: Paiement[]) => {
        // Tri des paiements par date (les plus récents d'abord)
        this.paiements = data.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return data;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des paiements:', error);
        return of([]);
      })
    );
  }

  loadIncidents(): Observable<IncidentWithStatus[]> {
    return this.incidentService.getIncidentsByProprietaire(this.userId).pipe(
      map((data: IncidentWithStatus[]) => {
        // Tri des incidents par date (les plus récents d'abord)
        this.incidents = data.sort((a, b) =>
          (b.date ? new Date(b.date).getTime() : 0) - (a.date ? new Date(a.date).getTime() : 0)
        );
        return data;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des incidents:', error);
        return of([]);
      })
    );
  }

  calculateStatistics(): void {
    // Statistiques des appartements
    this.totalAppartements = this.appartements.length;
    this.occupiedAppartements = this.appartements.filter(app => app.status === 'OCCUPE').length;
    this.freeAppartements = this.appartements.filter(app => app.status === 'LIBRE').length;

    // Statistiques financières des 12 derniers mois
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    this.totalRevenue = this.paiements
      .filter(p => p.status === 'PAYE' && new Date(p.date) >= oneYearAgo)
      .reduce((total, p) => total + p.montant, 0);
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAppartements = [...this.appartements];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredAppartements = this.appartements.filter(appartement =>
      appartement.numero.toLowerCase().includes(searchLower) ||
      appartement.etage.toString().includes(searchLower) ||
      appartement.status.toLowerCase().includes(searchLower)
    );
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'OCCUPE':
        return 'bg-green-100 text-green-800';
      case 'LIBRE':
        return 'bg-blue-100 text-blue-800';
      case 'EN_TRAVAUX':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPaymentMethodIcon(methode: string): string {
    switch (methode?.toUpperCase()) {
      case 'CARTE':
        return 'fas fa-credit-card';
      case 'VIREMENT':
        return 'fas fa-university';
      case 'ESPECES':
        return 'fas fa-money-bill-alt';
      case 'CHEQUE':
        return 'fas fa-money-check';
      default:
        return 'fas fa-money-bill';
    }
  }

  getRecentIncidents(): IncidentWithStatus[] {
    // Retourne les 3 incidents les plus récents
    return this.incidents.slice(0, 3);
  }

  // Méthode pour obtenir la classe CSS basée sur le statut de l'incident
  getIncidentStatusClass(incident: IncidentWithStatus): string {
    switch (incident.status) {
      case 'NOUVEAU':
        return 'bg-blue-100 text-blue-800';
      case 'EN_COURS':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLU':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Méthode pour obtenir le texte formaté du statut de l'incident
  getIncidentStatusText(incident: IncidentWithStatus): string {
    switch (incident.status) {
      case 'NOUVEAU':
        return 'Nouveau';
      case 'EN_COURS':
        return 'En cours';
      case 'RESOLU':
        return 'Résolu';
      default:
        return incident.status;
    }
  }
}
