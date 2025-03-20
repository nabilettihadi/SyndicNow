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
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar></app-navbar>
      
      <main class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-6">Gestion des immeubles</h1>
        
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
              <h2 class="text-xl font-semibold">Liste des immeubles</h2>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <i class="fas fa-plus mr-2"></i>Ajouter un immeuble
              </button>
            </div>
            
            <!-- Recherche -->
            <div class="mb-6">
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="searchTerm"
                  (keyup)="applyFilter()"
                  placeholder="Rechercher un immeuble..."
                  class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="absolute right-3 top-2 text-gray-400">
                  <i class="fas fa-search"></i>
                </span>
              </div>
            </div>
            
            <!-- Tableau des immeubles -->
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let immeuble of filteredImmeubles">
                    <td class="py-3 px-4 whitespace-nowrap">{{ immeuble.nom }}</td>
                    <td class="py-3 px-4 whitespace-nowrap">{{ immeuble.adresse }}</td>
                    <td class="py-3 px-4 whitespace-nowrap">{{ immeuble.ville }}</td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs rounded-full" [ngClass]="getStatusClass(immeuble.status)">
                        {{ immeuble.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4 whitespace-nowrap">
                      <a [routerLink]="['/syndic/immeubles', immeuble.id]" class="text-blue-600 hover:text-blue-800 mr-3">
                        <i class="fas fa-eye"></i>
                      </a>
                      <a [routerLink]="['/syndic/immeubles/edit', immeuble.id]" class="text-yellow-600 hover:text-yellow-800 mr-3">
                        <i class="fas fa-edit"></i>
                      </a>
                    </td>
                  </tr>
                  <tr *ngIf="filteredImmeubles.length === 0">
                    <td colspan="5" class="py-4 px-4 text-center text-gray-500">
                      Aucun immeuble trouvé
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
        return 'bg-green-100 text-green-800';
      case 'EN_CONSTRUCTION':
        return 'bg-blue-100 text-blue-800';
      case 'EN_MAINTENANCE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
} 