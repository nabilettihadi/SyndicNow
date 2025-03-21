import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { ImmeubleService } from '@core/services/immeuble.service';
import { Immeuble } from '@core/models/immeuble.model';

@Component({
  selector: 'app-list-immeubles',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './list-immeubles.component.html',
  styleUrls: []
})
export class ListImmeublesComponent implements OnInit {
  syndicId: number = 1; // À remplacer par l'ID du syndic actuel
  isLoading = true;
  hasError = false;
  errorMessage = '';
  
  immeubles: Immeuble[] = [];
  filteredImmeubles: Immeuble[] = [];
  searchTerm: string = '';

  constructor(private immeubleService: ImmeubleService) {}

  ngOnInit(): void {
    this.loadImmeubles();
  }

  loadImmeubles(): void {
    this.immeubleService.getImmeublesBySyndic(this.syndicId).subscribe({
      next: (data) => {
        this.immeubles = data;
        this.filteredImmeubles = [...this.immeubles];
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
      return;
    }
    
    const searchLower = this.searchTerm.toLowerCase();
    this.filteredImmeubles = this.immeubles.filter(immeuble => 
      immeuble.nom.toLowerCase().includes(searchLower) || 
      immeuble.adresse.toLowerCase().includes(searchLower) ||
      immeuble.ville.toLowerCase().includes(searchLower)
    );
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'ACTIF':
        return 'syndic-badge syndic-badge-success';
      case 'EN_CONSTRUCTION':
        return 'syndic-badge syndic-badge-info';
      case 'EN_MAINTENANCE':
        return 'syndic-badge syndic-badge-warning';
      default:
        return 'syndic-badge';
    }
  }
} 