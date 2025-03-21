import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { AppartementService } from '@core/services/appartement.service';
import { Appartement } from '@core/models/appartement.model';

@Component({
  selector: 'app-list-appartements',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './list-appartements.component.html',
  styleUrls: []
})
export class ListAppartementsComponent implements OnInit {
  syndicId: number = 1; // À remplacer par l'ID du syndic actuel
  isLoading = true;
  hasError = false;
  errorMessage = '';
  
  appartements: Appartement[] = [];
  filteredAppartements: Appartement[] = [];
  searchTerm: string = '';

  constructor(private appartementService: AppartementService) {}

  ngOnInit(): void {
    this.loadAppartements();
  }

  loadAppartements(): void {
    this.appartementService.getAppartementsBySyndic(this.syndicId).subscribe({
      next: (data: Appartement[]) => {
        this.appartements = data;
        this.filteredAppartements = [...this.appartements];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des appartements:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Une erreur est survenue lors du chargement des appartements';
      }
    });
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
      appartement.immeuble?.nom.toLowerCase().includes(searchLower) ||
      appartement.status.toLowerCase().includes(searchLower)
    );
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'OCCUPE':
        return 'syndic-badge syndic-badge-success';
      case 'LIBRE':
        return 'syndic-badge syndic-badge-info';
      case 'EN_TRAVAUX':
        return 'syndic-badge syndic-badge-warning';
      default:
        return 'syndic-badge';
    }
  }
} 