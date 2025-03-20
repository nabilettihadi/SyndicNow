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
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar></app-navbar>
      
      <main class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-6">Gestion des appartements</h1>
        
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
              <h2 class="text-xl font-semibold">Liste des appartements</h2>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <i class="fas fa-plus mr-2"></i>Ajouter un appartement
              </button>
            </div>
            
            <!-- Recherche et filtres -->
            <div class="mb-6">
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="searchTerm"
                  (keyup)="applyFilter()"
                  placeholder="Rechercher un appartement..."
                  class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="absolute right-3 top-2 text-gray-400">
                  <i class="fas fa-search"></i>
                </span>
              </div>
            </div>
            
            <!-- Tableau des appartements -->
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immeuble</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étage</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Superficie</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let appartement of filteredAppartements">
                    <td class="py-3 px-4 whitespace-nowrap">{{ appartement.immeuble?.nom || 'Non défini' }}</td>
                    <td class="py-3 px-4 whitespace-nowrap">{{ appartement.numero }}</td>
                    <td class="py-3 px-4 whitespace-nowrap">{{ appartement.etage }}</td>
                    <td class="py-3 px-4 whitespace-nowrap">{{ appartement.superficie }} m²</td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs rounded-full" [ngClass]="getStatusClass(appartement.status)">
                        {{ appartement.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <a [routerLink]="['/syndic/appartements', appartement.id]" class="text-blue-600 hover:text-blue-800 mr-3">
                        <i class="fas fa-eye"></i>
                      </a>
                      <a [routerLink]="['/syndic/appartements/edit', appartement.id]" class="text-yellow-600 hover:text-yellow-800 mr-3">
                        <i class="fas fa-edit"></i>
                      </a>
                    </td>
                  </tr>
                  <tr *ngIf="filteredAppartements.length === 0">
                    <td colspan="6" class="py-4 px-4 text-center text-gray-500">
                      Aucun appartement trouvé
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
        return 'bg-green-100 text-green-800';
      case 'LIBRE':
        return 'bg-blue-100 text-blue-800';
      case 'EN_TRAVAUX':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
} 