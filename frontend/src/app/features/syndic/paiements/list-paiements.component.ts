import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { PaiementService } from '@core/services/paiement.service';
import { Paiement } from '@core/models/paiement.model';

@Component({
  selector: 'app-list-paiements',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './list-paiements.component.html',
  styleUrls: []
})
export class ListPaiementsComponent implements OnInit {
  syndicId: number = 1; // À remplacer par l'ID du syndic actuel
  isLoading = true;
  hasError = false;
  errorMessage = '';
  
  paiements: Paiement[] = [];
  filteredPaiements: Paiement[] = [];
  searchTerm: string = '';
  statusFilter: string = 'ALL';

  constructor(private paiementService: PaiementService) {}

  ngOnInit(): void {
    this.loadPaiements();
  }

  loadPaiements(): void {
    this.paiementService.getPaiementsBySyndic(this.syndicId).subscribe({
      next: (data) => {
        this.paiements = data;
        this.filteredPaiements = [...this.paiements];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des paiements:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Une erreur est survenue lors du chargement des paiements';
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim() && this.statusFilter === 'ALL') {
      this.filteredPaiements = [...this.paiements];
      return;
    }
    
    let filtered = [...this.paiements];
    
    // Filtre par statut
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(paiement => paiement.status === this.statusFilter);
    }
    
    // Filtre par texte de recherche
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(paiement => 
        paiement.reference.toLowerCase().includes(searchLower) || 
        paiement.montant.toString().includes(searchLower) ||
        paiement.methode.toLowerCase().includes(searchLower) ||
        (paiement.proprietaire?.nom.toLowerCase() + ' ' + paiement.proprietaire?.prenom.toLowerCase()).includes(searchLower)
      );
    }
    
    this.filteredPaiements = filtered;
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'PAYE':
        return 'syndic-badge syndic-badge-success';
      case 'EN_ATTENTE':
        return 'syndic-badge syndic-badge-warning';
      case 'RETARDE':
        return 'syndic-badge syndic-badge-error';
      case 'ANNULE':
        return 'syndic-badge';
      default:
        return 'syndic-badge';
    }
  }
} 