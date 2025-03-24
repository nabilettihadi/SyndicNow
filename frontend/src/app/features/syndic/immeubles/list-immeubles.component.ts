import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {FooterComponent} from '@shared/components/footer/footer.component';
import {ImmeubleService} from '@core/services/immeuble.service';
import {Immeuble} from '@core/models/immeuble.model';
import {AuthService} from '@core/services/auth.service';

@Component({
  selector: 'app-list-immeubles',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FooterComponent],
  templateUrl: './list-immeubles.component.html',
  styleUrls: []
})
export class ListImmeublesComponent implements OnInit {
  syndicId: number | null = null;
  isLoading = true;
  hasError = false;
  errorMessage = '';

  immeubles: Immeuble[] = [];
  filteredImmeubles: Immeuble[] = [];
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 9;
  totalItems: number = 0;

  constructor(
    private immeubleService: ImmeubleService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.syndicId = this.authService.getCurrentUser()?.userId || null;
    if (this.syndicId) {
      this.loadImmeubles();
    } else {
      this.hasError = true;
      this.errorMessage = 'Utilisateur non authentifié';
      this.isLoading = false;
    }
  }

  loadImmeubles(): void {
    this.isLoading = true;
    this.immeubleService.getImmeublesBySyndic(this.syndicId as number).subscribe({
      next: (data) => {
        this.immeubles = data;
        this.filteredImmeubles = [...this.immeubles];
        this.totalItems = this.immeubles.length;
        this.applyPagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des immeubles:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Une erreur est survenue lors du chargement des immeubles';
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredImmeubles = [...this.immeubles];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredImmeubles = this.immeubles.filter(immeuble =>
        immeuble.nom?.toLowerCase().includes(searchLower) ||
        immeuble.adresse?.toLowerCase().includes(searchLower) ||
        immeuble.ville?.toLowerCase().includes(searchLower)
      );
    }

    this.totalItems = this.filteredImmeubles.length;
    this.currentPage = 1;
    this.applyPagination();
  }

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredImmeubles.length);
    this.filteredImmeubles = [...this.immeubles.slice(startIndex, endIndex)];
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.applyPagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyPagination();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'ACTIF':
        return 'syndic-badge syndic-badge-success';
      case 'EN_TRAVAUX':
        return 'syndic-badge syndic-badge-info';
      case 'EN_MAINTENANCE':
        return 'syndic-badge syndic-badge-warning';
      case 'INACTIF':
        return 'syndic-badge syndic-badge-danger';
      default:
        return 'syndic-badge';
    }
  }

  getTailwindStatusClass(statut: string): string {
    switch (statut) {
      case 'ACTIF':
        return 'bg-green-100 text-green-800';
      case 'EN_TRAVAUX':
        return 'bg-blue-100 text-blue-800';
      case 'EN_MAINTENANCE':
        return 'bg-amber-100 text-amber-800';
      case 'INACTIF':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getImmeublesCount(): number {
    return this.immeubles.length;
  }

  getActiveImmeublesCount(): number {
    return this.immeubles.filter(immeuble => immeuble.status === 'ACTIF').length;
  }

  getInactiveImmeublesCount(): number {
    return this.immeubles.filter(immeuble => immeuble.status === 'INACTIF').length;
  }

  getUnderConstructionImmeublesCount(): number {
    return this.immeubles.filter(immeuble => immeuble.status === 'EN_TRAVAUX').length;
  }

  getImmeublesCountByStatus(status: string): number {
    return this.immeubles.filter(immeuble => immeuble.status === status).length;
  }

  getTotalAppartementsCount(): number {
    return this.immeubles.reduce((total, immeuble) => total + (immeuble.nombreAppartements || 0), 0);
  }
}
