import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SyndicService } from '@core/services/syndic.service';
import { Syndic } from '@core/models/syndic.model';

interface SyndicStats {
  totalSyndics: number;
  activeSyndics: number;
  pendingSyndics: number;
  totalBuildings: number;
}

@Component({
  selector: 'app-list-syndics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-syndics.component.html',
  styles: []
})
export class ListSyndicsComponent implements OnInit {
  syndics: Syndic[] = [];
  filteredSyndics: Syndic[] = [];
  stats: SyndicStats = {
    totalSyndics: 0,
    activeSyndics: 0,
    pendingSyndics: 0,
    totalBuildings: 0
  };
  searchTerm: string = '';
  filterStatus: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private syndicService: SyndicService) {}

  ngOnInit(): void {
    this.loadSyndics();
  }

  loadSyndics(): void {
    this.isLoading = true;
    this.syndicService.getAllSyndics().subscribe({
      next: (data) => {
        this.syndics = Array.isArray(data) ? this.transformSyndicsData(data) : [];
        this.calculateStats();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des syndics:', error);
        this.error = 'Une erreur est survenue lors du chargement des syndics';
        this.isLoading = false;
      }
    });
  }

  transformSyndicsData(syndics: Syndic[]): Syndic[] {
    return syndics.map(syndic => {
      if (syndic.immeubles && !syndic.nombreImmeubles) {
        syndic.nombreImmeubles = syndic.immeubles.length;
      } else if (!syndic.immeubles) {
        syndic.immeubles = [];
        if (!syndic.nombreImmeubles) {
          syndic.nombreImmeubles = 0;
        }
      }
      return syndic;
    });
  }

  calculateStats(): void {
    if (!this.syndics || this.syndics.length === 0) {
      this.stats = {
        totalSyndics: 0,
        activeSyndics: 0,
        pendingSyndics: 0,
        totalBuildings: 0
      };
      return;
    }

    this.stats.totalSyndics = this.syndics.length;
    
    // Calculer le nombre de syndics actifs
    this.stats.activeSyndics = this.syndics.filter(
      syndic => syndic.status && syndic.status.toUpperCase() === 'ACTIF'
    ).length;
    
    // Calculer le nombre de syndics en attente
    this.stats.pendingSyndics = this.syndics.filter(
      syndic => syndic.status && syndic.status.toUpperCase() === 'EN_ATTENTE'
    ).length;
    
    // Calculer le nombre total d'immeubles gérés
    this.stats.totalBuildings = this.syndics.reduce(
      (total, syndic) => {
        // Vérifier si nombreImmeubles existe
        if (syndic.nombreImmeubles !== undefined) {
          return total + syndic.nombreImmeubles;
        }
        // Sinon, utiliser la longueur du tableau immeubles si disponible 
        else if (syndic.immeubles && Array.isArray(syndic.immeubles)) {
          return total + syndic.immeubles.length;
        }
        return total;
      }, 
      0
    );
  }

  applyFilters(): void {
    if (!Array.isArray(this.syndics)) {
      this.syndics = [];
    }

    let filtered = [...this.syndics];

    // Recherche
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.nom?.toLowerCase().includes(search) ||
        s.email?.toLowerCase().includes(search)
      );
    }

    // Filtre par statut
    if (this.filterStatus) {
      filtered = filtered.filter(s => s.status === this.filterStatus);
    }

    // Pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredSyndics = filtered.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIF':
        return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIF':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIconClass(status: string): string {
    switch (status) {
      case 'ACTIF':
        return 'bg-green-100';
      case 'EN_ATTENTE':
        return 'bg-yellow-100';
      case 'INACTIF':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ACTIF':
        return 'fas fa-check-circle text-green-600';
      case 'EN_ATTENTE':
        return 'fas fa-clock text-yellow-600';
      case 'INACTIF':
        return 'fas fa-times-circle text-red-600';
      default:
        return 'fas fa-question-circle text-gray-600';
    }
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }
} 