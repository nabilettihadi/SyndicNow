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
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar></app-navbar>
      
      <main class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-6">Gestion des paiements</h1>
        
        <!-- Chargement et erreur -->
        <div *ngIf="isLoading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
        
        <div *ngIf="hasError" class="bg-red-50 p-4 rounded-md text-red-700 mb-6">
          {{ errorMessage }}
        </div>
        
        <!-- Contenu principal -->
        <div *ngIf="!isLoading && !hasError">
          <div class="bg-white p-6 rounded-lg shadow-md mb-8">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">Liste des paiements</h2>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <i class="fas fa-plus mr-2"></i>Ajouter un paiement
              </button>
            </div>
            
            <!-- Recherche et filtres -->
            <div class="flex flex-wrap gap-4 mb-6">
              <div class="relative flex-grow">
                <input
                  type="text"
                  [(ngModel)]="searchTerm"
                  (keyup)="applyFilter()"
                  placeholder="Rechercher un paiement..."
                  class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="absolute right-3 top-2 text-gray-400">
                  <i class="fas fa-search"></i>
                </span>
              </div>
              
              <div class="flex gap-2">
                <select 
                  [(ngModel)]="statusFilter" 
                  (change)="applyFilter()"
                  class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="PAYE">Payé</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="RETARDE">Retardé</option>
                  <option value="ANNULE">Annulé</option>
                </select>
              </div>
            </div>
            
            <!-- Tableau des paiements -->
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propriétaire</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let paiement of filteredPaiements">
                    <td class="py-3 px-4 whitespace-nowrap">{{ paiement.reference }}</td>
                    <td class="py-3 px-4 whitespace-nowrap">{{ paiement.date | date:'dd/MM/yyyy' }}</td>
                    <td class="py-3 px-4 whitespace-nowrap">{{ paiement.montant | currency:'MAD ' }}</td>
                    <td class="py-3 px-4 whitespace-nowrap">{{ paiement.methode }}</td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs rounded-full" [ngClass]="getStatusClass(paiement.status)">
                        {{ paiement.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      {{ paiement.proprietaire?.nom }} {{ paiement.proprietaire?.prenom }}
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <a [routerLink]="['/syndic/paiements', paiement.id]" class="text-blue-600 hover:text-blue-800 mr-3">
                        <i class="fas fa-eye"></i>
                      </a>
                      <a [routerLink]="['/syndic/paiements/edit', paiement.id]" class="text-yellow-600 hover:text-yellow-800 mr-3">
                        <i class="fas fa-edit"></i>
                      </a>
                    </td>
                  </tr>
                  <tr *ngIf="filteredPaiements.length === 0">
                    <td colspan="7" class="py-4 px-4 text-center text-gray-500">
                      Aucun paiement trouvé
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      
      <app-footer></app-footer>
    </div>
  `,
  styles: []
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
} 