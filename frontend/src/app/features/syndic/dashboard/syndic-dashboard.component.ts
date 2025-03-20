import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { SyndicService } from '@core/services/syndic.service';
import { ImmeubleService } from '@core/services/immeuble.service';
import { PaiementService } from '@core/services/paiement.service';
import { IncidentService } from '@core/services/incident.service';
import { Immeuble } from '@core/models/immeuble.model';
import { Paiement } from '@core/models/paiement.model';
import { Incident, IncidentWithStatus } from '@core/models/incident.model';

@Component({
  selector: 'app-syndic-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule, FormsModule],
  templateUrl: './syndic-dashboard.component.html',
  styles: []
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

  constructor(
    private syndicService: SyndicService,
    private immeubleService: ImmeubleService,
    private paiementService: PaiementService,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID syndic depuis le service d'authentification
    // this.syndicId = this.authService.currentUserValue?.id;
    
    forkJoin({
      immeubles: this.loadBuildings(),
      paiements: this.loadPayments(),
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

  loadBuildings(): Observable<Immeuble[]> {
    return this.immeubleService.getImmeublesBySyndic(this.syndicId).pipe(
      map((data: Immeuble[]) => {
        this.immeubles = data;
        this.filteredBuildings = [...this.immeubles];
        return data;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des immeubles:', error);
        return of([]);
      })
    );
  }

  loadPayments(): Observable<Paiement[]> {
    return this.paiementService.getPaiementsBySyndic(this.syndicId).pipe(
      map((data: Paiement[]) => {
        this.paiements = data;
        return data;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des paiements:', error);
        return of([]);
      })
    );
  }

  loadIncidents(): Observable<IncidentWithStatus[]> {
    return this.incidentService.getIncidentsBySyndic(this.syndicId).pipe(
      map((data: IncidentWithStatus[]) => {
        this.incidents = data;
        return data;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des incidents:', error);
        return of([]);
      })
    );
  }

  calculateStatistics(): void {
    this.totalBuildings = this.immeubles.length;
    this.activeBuildings = this.immeubles.filter(imm => imm.status === 'ACTIF').length;
    this.pendingPayments = this.paiements.filter(p => p.status === 'EN_ATTENTE').length;
    this.totalRevenue = this.paiements
      .filter(p => p.status === 'PAYE')
      .reduce((total, p) => total + p.montant, 0);
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