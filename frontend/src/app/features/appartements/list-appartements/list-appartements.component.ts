import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppartementService } from '@core/services/appartement.service';
import { AppartementDetails } from '@core/models/appartement.model';

@Component({
  selector: 'app-list-appartements',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-appartements.component.html',
  styleUrls: ['./list-appartements.component.css']
})
export class ListAppartementsComponent implements OnInit {
  appartements: AppartementDetails[] = [];
  immeubles: { id: number; nom: string }[] = [];
  filteredAppartements: AppartementDetails[] = [];
  selectedStatut: string = '';
  selectedEtage: number | '' = '';
  searchTerm: string = '';
  loading = false;
  error: string | null = null;
  etages: number[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 1;
  filterImmeuble: string = '';
  filterStatus: string = '';
  sortBy: string = 'numero';

  constructor(
    private appartementService: AppartementService,
    private router: Router
  ) {
    this.etages = Array.from({ length: 23 }, (_, i) => i - 2);
  }

  ngOnInit(): void {
    this.loadAppartements();
    this.loadImmeubles();
  }

  private loadAppartements(): void {
    this.loading = true;
    this.appartementService.getAllAppartementsDetails().subscribe({
      next: (data: AppartementDetails[]) => {
        this.appartements = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Erreur lors du chargement des appartements:', error);
        this.error = 'Erreur lors du chargement des appartements';
        this.loading = false;
      }
    });
  }

  private loadImmeubles() {
    // Simuler le chargement des immeubles
    this.immeubles = [
      { id: 1, nom: 'Résidence Atlas' },
      { id: 2, nom: 'Résidence Oasis' },
      // Ajouter plus d'immeubles...
    ];
  }

  onSearch() {
    this.applyFilters();
  }

  onEtageChange() {
    this.applyFilters();
  }

  onStatutChange() {
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.appartements];

    // Recherche
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.numero.toLowerCase().includes(search) ||
        (app.immeuble && app.immeuble.nom && app.immeuble.nom.toLowerCase().includes(search))
      );
    }

    // Filtre par immeuble
    if (this.filterImmeuble) {
      filtered = filtered.filter(app => app.immeubleId.toString() === this.filterImmeuble);
    }

    // Filtre par statut
    if (this.filterStatus) {
      filtered = filtered.filter(app => app.status === this.filterStatus);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'numero':
          return a.numero.localeCompare(b.numero);
        case 'etage':
          return a.etage - b.etage;
        case 'surface':
          return a.surface - b.surface;
        case 'loyer':
          return a.loyer - b.loyer;
        default:
          return 0;
      }
    });

    // Pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredAppartements = filtered.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  formatSurface(surface: number | undefined): string {
    return surface ? `${surface} m²` : 'N/A';
  }

  formatLoyer(loyer: number | undefined): string {
    return loyer ? `${loyer} €` : 'N/A';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'OCCUPE':
        return 'bg-green-100 text-green-800';
      case 'LIBRE':
        return 'bg-blue-100 text-blue-800';
      case 'EN_TRAVAUX':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  openAddAppartementModal(): void {
    this.router.navigate(['/appartements/new']);
  }

  editAppartement(appartement: AppartementDetails): void {
    this.router.navigate([`/appartements/edit/${appartement.id}`]);
  }

  deleteAppartement(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet appartement ?')) {
      this.appartementService.deleteAppartement(id).subscribe({
        next: () => {
          this.loadAppartements();
        },
        error: (error: Error) => {
          console.error('Erreur lors de la suppression:', error);
          this.error = 'Impossible de supprimer l\'appartement. Veuillez réessayer plus tard.';
        }
      });
    }
  }
} 