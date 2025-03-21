import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { AppartementService } from '@core/services/appartement.service';
import { PaiementService } from '@core/services/paiement.service';
import { IncidentService } from '@core/services/incident.service';
import { Appartement } from '@core/models/appartement.model';
import { Paiement } from '@core/models/paiement.model';
import { Incident, IncidentWithStatus } from '@core/models/incident.model';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-proprietaire-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule, FormsModule],
  templateUrl: './proprietaire-dashboard.component.html',
  styles: []
})
export class ProprietaireDashboardComponent implements OnInit {
  userId: number = 1; // À remplacer par l'ID de l'utilisateur actuel
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

  constructor(
    private appartementService: AppartementService,
    private paiementService: PaiementService,
    private incidentService: IncidentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID utilisateur depuis le service d'authentification
    // this.userId = this.authService.currentUserValue?.id;
    
    // Simuler une date de dernière connexion
    this.lastLoginDate = new Date(new Date().getTime() - Math.floor(Math.random() * 24 * 60 * 60 * 1000));
    
    forkJoin({
      appartements: this.loadAppartements(),
      paiements: this.loadPaiements(),
      incidents: this.loadIncidents()
    }).subscribe({
      next: () => {
        this.calculateStatistics();
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
    this.totalAppartements = this.appartements.length;
    this.occupiedAppartements = this.appartements.filter(app => app.status === 'OCCUPE').length;
    this.freeAppartements = this.appartements.filter(app => app.status === 'LIBRE').length;
    this.totalRevenue = this.paiements
      .filter(p => p.status === 'PAYE')
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
} 