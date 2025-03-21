import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProprietaireService } from '@core/services/proprietaire.service';
import { Proprietaire } from '@core/models/proprietaire.model';

interface ProprietaireStats {
  total: number;
  actifs: number;
  inactifs: number;
  avecAppartements: number;
}

@Component({
  selector: 'app-list-proprietaires',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="md:flex md:items-center md:justify-between">
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl font-bold text-gray-900">
                Gestion des Propriétaires
              </h1>
              <p class="mt-1 text-sm text-gray-500">
                Liste et gestion des propriétaires
              </p>
            </div>
            <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <button type="button" 
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <i class="fas fa-download -ml-1 mr-2"></i>
                Exporter
              </button>
              <button type="button" 
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <i class="fas fa-plus -ml-1 mr-2"></i>
                Nouveau Propriétaire
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Statistiques -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Total Propriétaires -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="rounded-md p-3 bg-blue-50">
                    <i class="fas fa-users text-blue-600 text-xl"></i>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Total Propriétaires
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{stats.total}}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Propriétaires Actifs -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="rounded-md p-3 bg-green-50">
                    <i class="fas fa-check-circle text-green-600 text-xl"></i>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Propriétaires Actifs
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{stats.actifs}}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Propriétaires Inactifs -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="rounded-md p-3 bg-red-50">
                    <i class="fas fa-times-circle text-red-600 text-xl"></i>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Propriétaires Inactifs
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{stats.inactifs}}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Avec Appartements -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="rounded-md p-3 bg-purple-50">
                    <i class="fas fa-home text-purple-600 text-xl"></i>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Avec Appartements
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{stats.avecAppartements}}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtres et recherche -->
        <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="relative rounded-md shadow-sm">
            <input type="text"
                  [(ngModel)]="searchTerm"
                  (ngModelChange)="applyFilters()"
                  placeholder="Rechercher un propriétaire..."
                  class="block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500">
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
          </div>

          <select [(ngModel)]="filterStatus"
                  (ngModelChange)="applyFilters()"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
            <option value="">Tous les statuts</option>
            <option value="ACTIF">Actif</option>
            <option value="INACTIF">Inactif</option>
          </select>
        </div>

        <!-- Liste des propriétaires -->
        <div class="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propriétaire
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appartements
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let proprietaire of filteredProprietaires" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-primary-700">
                          {{getInitials(proprietaire.nom + ' ' + proprietaire.prenom)}}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{proprietaire.prenom}} {{proprietaire.nom}}
                        </div>
                        <div class="text-sm text-gray-500">
                          Inscrit le {{formatDate(proprietaire.dateCreation)}}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{proprietaire.email}}</div>
                    <div class="text-sm text-gray-500">{{proprietaire.telephone}}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{proprietaire.appartements?.length || 0}} appartement(s)
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusClass(proprietaire.status)"
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{formatStatus(proprietaire.status)}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a [routerLink]="['/admin/proprietaires', proprietaire.id]"
                      class="text-indigo-600 hover:text-indigo-900 mr-3">
                      Détails
                    </a>
                    <a [routerLink]="['/admin/proprietaires/edit', proprietaire.id]" 
                      class="text-yellow-600 hover:text-yellow-900">
                      Modifier
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Message si aucun propriétaire trouvé -->
        <div *ngIf="filteredProprietaires.length === 0 && !isLoading" 
            class="text-center py-12">
          <i class="fas fa-user text-gray-400 text-5xl mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900">Aucun propriétaire trouvé</h3>
          <p class="mt-1 text-gray-500">
            Aucun propriétaire ne correspond à vos critères de recherche.
          </p>
        </div>

        <!-- Chargement -->
        <div *ngIf="isLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>

        <!-- Pagination -->
        <div *ngIf="totalPages > 1 && !isLoading" class="mt-4 flex justify-center">
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button *ngFor="let page of [].constructor(totalPages); let i = index"
                    (click)="changePage(i + 1)"
                    [class.bg-primary-50]="currentPage === i + 1"
                    [class.border-primary-500]="currentPage === i + 1"
                    [class.text-primary-600]="currentPage === i + 1"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              {{i + 1}}
            </button>
          </nav>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class ListProprietairesComponent implements OnInit {
  proprietaires: Proprietaire[] = [];
  filteredProprietaires: Proprietaire[] = [];
  
  stats: ProprietaireStats = {
    total: 0,
    actifs: 0,
    inactifs: 0,
    avecAppartements: 0
  };
  
  searchTerm: string = '';
  filterStatus: string = '';
  
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private proprietaireService: ProprietaireService) {}

  ngOnInit(): void {
    this.loadProprietaires();
  }

  loadProprietaires(): void {
    this.isLoading = true;
    this.proprietaireService.getAllProprietaires().subscribe({
      next: (data) => {
        this.proprietaires = data;
        this.calculateStats();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des propriétaires:', error);
        this.error = 'Une erreur est survenue lors du chargement des propriétaires';
        this.isLoading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats = {
      total: this.proprietaires.length,
      actifs: this.proprietaires.filter(p => p.status === 'ACTIF').length,
      inactifs: this.proprietaires.filter(p => p.status === 'INACTIF').length,
      avecAppartements: this.proprietaires.filter(p => p.appartements && p.appartements.length > 0).length
    };
  }

  applyFilters(): void {
    let filtered = [...this.proprietaires];

    // Recherche
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.nom?.toLowerCase().includes(search) ||
        p.prenom?.toLowerCase().includes(search) ||
        p.email?.toLowerCase().includes(search)
      );
    }

    // Filtre par statut
    if (this.filterStatus) {
      filtered = filtered.filter(p => p.status === this.filterStatus);
    }

    // Pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredProprietaires = filtered.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIF':
        return 'bg-green-100 text-green-800';
      case 'INACTIF':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'ACTIF':
        return 'Actif';
      case 'INACTIF':
        return 'Inactif';
      default:
        return status;
    }
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getInitials(name: string): string {
    return name.split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase();
  }
} 