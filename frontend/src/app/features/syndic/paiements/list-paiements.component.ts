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
  periodeFilter: string = 'ALL';

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
    if (!this.searchTerm.trim() && this.statusFilter === 'ALL' && this.periodeFilter === 'ALL') {
      this.filteredPaiements = [...this.paiements];
      return;
    }
    
    let filtered = [...this.paiements];
    
    // Filtre par statut
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(paiement => paiement.status === this.statusFilter);
    }
    
    // Filtre par période
    if (this.periodeFilter !== 'ALL') {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      switch (this.periodeFilter) {
        case 'THIS_MONTH':
          filtered = filtered.filter(paiement => {
            const paiementDate = new Date(paiement.date);
            return paiementDate.getMonth() === currentMonth && 
                   paiementDate.getFullYear() === currentYear;
          });
          break;
        case 'LAST_MONTH':
          filtered = filtered.filter(paiement => {
            const paiementDate = new Date(paiement.date);
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return paiementDate.getMonth() === lastMonth && 
                   paiementDate.getFullYear() === lastMonthYear;
          });
          break;
        case 'THIS_YEAR':
          filtered = filtered.filter(paiement => {
            const paiementDate = new Date(paiement.date);
            return paiementDate.getFullYear() === currentYear;
          });
          break;
      }
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

  getTotalByStatus(status: string): number {
    return this.paiements.filter(paiement => paiement.status === status).length;
  }

  getStatusBadgeClass(statut: string): string {
    switch (statut) {
      case 'PAYE':
        return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'RETARDE':
        return 'bg-red-100 text-red-800';
      case 'ANNULE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PAYE':
        return 'Payé';
      case 'EN_ATTENTE':
        return 'En attente';
      case 'RETARDE':
        return 'Retardé';
      case 'ANNULE':
        return 'Annulé';
      default:
        return status;
    }
  }

  deletePaiement(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      this.paiementService.deletePaiement(id).subscribe({
        next: () => {
          this.paiements = this.paiements.filter(p => p.id !== id);
          this.filteredPaiements = this.filteredPaiements.filter(p => p.id !== id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du paiement:', error);
          alert('Une erreur est survenue lors de la suppression du paiement');
        }
      });
    }
  }
} 