import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { SyndicService } from '@core/services/syndic.service';
import { ImmeubleService } from '@core/services/immeuble.service';
import { AppartementService } from '@core/services/appartement.service';
import { ProprietaireService } from '@core/services/proprietaire.service';

import { Syndic } from '@core/models/syndic.model';
import { Immeuble } from '@core/models/immeuble.model';
import { Appartement } from '@core/models/appartement.model';
import { Proprietaire } from '@core/models/proprietaire.model';

interface DashboardStats {
  totalSyndics: number;
  totalImmeubles: number;
  totalAppartements: number;
  totalProprietaires: number;
  syndicActifs: number;
  syndicInactifs: number;
  appartementOccupes: number;
  appartementLibres: number;
  immeubleParVille: { [key: string]: number };
  syndicParVille: { [key: string]: number };
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  // Données
  syndics: Syndic[] = [];
  immeubles: Immeuble[] = [];
  appartements: Appartement[] = [];
  proprietaires: Proprietaire[] = [];
  stats: DashboardStats = {
    totalSyndics: 0,
    totalImmeubles: 0,
    totalAppartements: 0,
    totalProprietaires: 0,
    syndicActifs: 0,
    syndicInactifs: 0,
    appartementOccupes: 0,
    appartementLibres: 0,
    immeubleParVille: {},
    syndicParVille: {}
  };

  // Filtres pour la liste des syndics
  searchTerm: string = '';
  filterVille: string = '';
  filterStatus: string = '';
  villes: string[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // État de chargement
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private syndicService: SyndicService,
    private immeubleService: ImmeubleService,
    private appartementService: AppartementService,
    private proprietaireService: ProprietaireService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // Chargement des données
  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      syndics: this.syndicService.getAllSyndics(),
      immeubles: this.immeubleService.getAllImmeubles(),
      appartements: this.appartementService.getAllAppartements(),
      proprietaires: this.proprietaireService.getAllProprietaires(),
      syndicStats: this.syndicService.getSyndicStats(),
      immeubleStats: this.immeubleService.getImmeubleStats(),
      appartementStats: this.appartementService.getAppartementStats(),
      proprietaireStats: this.proprietaireService.getProprietaireStats()
    }).subscribe({
      next: (data) => {
        this.syndics = data.syndics;
        this.immeubles = data.immeubles;
        this.appartements = data.appartements;
        this.proprietaires = data.proprietaires;
        this.calculateStats();
        this.extractVilles();
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.error = 'Une erreur est survenue lors du chargement des données.';
        this.loading = false;
      }
    });
  }

  // Calcul des statistiques
  private calculateStats(): void {
    this.stats.totalSyndics = this.syndics.length;
    this.stats.totalImmeubles = this.immeubles.length;
    this.stats.totalAppartements = this.appartements.length;
    this.stats.totalProprietaires = this.proprietaires.length;
    
    this.stats.syndicActifs = this.syndics.filter(s => s.status === 'ACTIF').length;
    this.stats.syndicInactifs = this.syndics.filter(s => s.status === 'INACTIF').length;
    
    this.stats.appartementOccupes = this.appartements.filter(a => a.status === 'OCCUPE').length;
    this.stats.appartementLibres = this.appartements.filter(a => a.status === 'LIBRE').length;

    // Calcul des statistiques par ville
    this.stats.syndicParVille = this.syndics.reduce((acc, syndic) => {
      acc[syndic.ville] = (acc[syndic.ville] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    this.stats.immeubleParVille = this.immeubles.reduce((acc, immeuble) => {
      acc[immeuble.ville] = (acc[immeuble.ville] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  // Extraction des villes uniques
  private extractVilles(): void {
    const villeSet = new Set([
      ...this.syndics.map(s => s.ville),
      ...this.immeubles.map(i => i.ville)
    ]);
    this.villes = Array.from(villeSet).sort();
  }

  // Gestion des filtres
  applyFilters(): void {
    let filtered = [...this.syndics];

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(syndic =>
        syndic.nom.toLowerCase().includes(searchLower) ||
        syndic.email.toLowerCase().includes(searchLower) ||
        syndic.telephone.includes(searchLower)
      );
    }

    if (this.filterVille) {
      filtered = filtered.filter(syndic => syndic.ville === this.filterVille);
    }

    if (this.filterStatus) {
      filtered = filtered.filter(syndic => syndic.status === this.filterStatus);
    }

    this.syndics = filtered;
    this.totalPages = Math.ceil(this.syndics.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  // Pagination
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get paginatedSyndics(): Syndic[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.syndics.slice(start, end);
  }

  // Utilitaires
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getStatusClass(status: string): string {
    return status === 'ACTIF'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  }

  // Actions
  refreshData(): void {
    this.loadDashboardData();
  }

  exportData(): void {
    // TODO: Implémenter l'export des données
  }
} 