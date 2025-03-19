import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaiementService } from '@core/services/paiement.service';
import { Paiement } from '@core/models/paiement.model';

interface Immeuble {
  id: number;
  nom: string;
}

interface PaiementStats {
  totalAmount: number;
  monthlyAmount: number;
  pendingCount: number;
  lateCount: number;
}

@Component({
  selector: 'app-list-paiements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-paiements.component.html',
  styleUrls: ['./list-paiements.component.css']
})
export class ListPaiementsComponent implements OnInit {
  paiements: Paiement[] = [];
  immeubles: Immeuble[] = [];
  filteredPaiements: Paiement[] = [];
  stats: PaiementStats = {
    totalAmount: 0,
    monthlyAmount: 0,
    pendingCount: 0,
    lateCount: 0
  };
  searchTerm: string = '';
  filterImmeuble: string = '';
  filterStatus: string = '';
  filterDateDebut: string = '';
  filterDateFin: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private paiementService: PaiementService) {}

  ngOnInit(): void {
    this.loadPaiements();
    this.loadImmeubles();
    this.calculateStats();
  }

  loadPaiements(): void {
    this.paiementService.getAllPaiements().subscribe({
      next: (data) => {
        this.paiements = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des paiements:', error);
      }
    });
  }

  loadImmeubles(): void {
    // Simulation de données
    this.immeubles = [
      { id: 1, nom: 'Résidence Atlas' },
      { id: 2, nom: 'Résidence Oasis' },
      // Ajouter plus d'immeubles...
    ];
  }

  calculateStats(): void {
    this.stats = {
      totalAmount: this.paiements.reduce((sum, p) => sum + p.montant, 0),
      monthlyAmount: this.paiements
        .filter(p => new Date(p.datePaiement).getMonth() === new Date().getMonth())
        .reduce((sum, p) => sum + p.montant, 0),
      pendingCount: this.paiements.filter(p => p.status === 'EN_ATTENTE').length,
      lateCount: this.paiements.filter(p => p.status === 'RETARDE').length
    };
  }

  applyFilters(): void {
    let filtered = [...this.paiements];

    // Recherche
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.reference.toLowerCase().includes(search) ||
        p.locataire.nom.toLowerCase().includes(search) ||
        p.locataire.prenom.toLowerCase().includes(search) ||
        p.immeubleId?.toString().toLowerCase().includes(search)
      );
    }

    // Filtre par immeuble
    if (this.filterImmeuble) {
      filtered = filtered.filter(p => p.immeubleId?.toString() === this.filterImmeuble);
    }

    // Filtre par statut
    if (this.filterStatus) {
      filtered = filtered.filter(p => p.status === this.filterStatus);
    }

    // Filtre par date
    if (this.filterDateDebut) {
      const debut = new Date(this.filterDateDebut);
      filtered = filtered.filter(p => new Date(p.datePaiement) >= debut);
    }
    if (this.filterDateFin) {
      const fin = new Date(this.filterDateFin);
      filtered = filtered.filter(p => new Date(p.datePaiement) <= fin);
    }

    // Pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredPaiements = filtered.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PAYE':
        return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'EN_RETARD':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIconClass(status: string): string {
    switch (status) {
      case 'PAYE':
        return 'bg-green-100';
      case 'EN_ATTENTE':
        return 'bg-yellow-100';
      case 'EN_RETARD':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PAYE':
        return 'fas fa-check text-green-600';
      case 'EN_ATTENTE':
        return 'fas fa-clock text-yellow-600';
      case 'EN_RETARD':
        return 'fas fa-exclamation-circle text-red-600';
      default:
        return 'fas fa-question text-gray-600';
    }
  }

  openAddPaiementModal(): void {
    // Implémenter la logique d'ouverture du modal
  }

  exportPaiements(): void {
    // Implémenter la logique d'export
  }

  viewPaiementDetails(paiement: Paiement): void {
    // Implémenter la logique d'affichage des détails
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  formatMontant(montant: number): string {
    return `${montant.toLocaleString('fr-FR')} €`;
  }
} 