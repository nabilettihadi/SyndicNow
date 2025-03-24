import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ProprietaireService} from '@core/services/proprietaire.service';
import {Proprietaire} from '@core/models/proprietaire.model';
import {ToastrService} from 'ngx-toastr';

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
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <i class="fas fa-plus -ml-1 mr-2"></i>
                Nouveau Propriétaire
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Message d'erreur -->
        <div *ngIf="error" class="rounded-md bg-red-50 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- État du chargement -->
        <div *ngIf="isLoading" class="flex justify-center my-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>

        <!-- Liste des propriétaires -->
        <div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appartements
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let proprietaire of proprietaires">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ proprietaire.nom }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ proprietaire.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ proprietaire.telephone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ proprietaire.appartements?.length || 0 }} appartement(s)</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <button [routerLink]="['/admin/proprietaires', proprietaire.id]"
                        class="text-blue-600 hover:text-blue-900">
                  <i class="fas fa-eye"></i>
                </button>
                <button (click)="supprimerProprietaire(proprietaire)"
                        class="text-red-600 hover:text-red-900">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Message si aucun propriétaire -->
        <div *ngIf="!isLoading && proprietaires.length === 0" class="text-center py-12">
          <i class="fas fa-users text-gray-400 text-5xl mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900">Aucun propriétaire trouvé</h3>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class ListProprietairesComponent implements OnInit {
  proprietaires: Proprietaire[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private proprietaireService: ProprietaireService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.loadProprietaires();
  }

  loadProprietaires(): void {
    this.isLoading = true;
    this.proprietaireService.getAllProprietaires().subscribe({
      next: (data) => {
        this.proprietaires = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des propriétaires:', error);
        this.error = 'Une erreur est survenue lors du chargement des propriétaires';
        this.isLoading = false;
      }
    });
  }

  supprimerProprietaire(proprietaire: Proprietaire): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le propriétaire ${proprietaire.nom} ?`)) {
      this.proprietaireService.deleteProprietaire(proprietaire.id).subscribe({
        next: () => {
          this.proprietaires = this.proprietaires.filter(p => p.id !== proprietaire.id);
          this.toastr.success('Le propriétaire a été supprimé avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du propriétaire:', error);
          this.toastr.error('Une erreur est survenue lors de la suppression du propriétaire');
        }
      });
    }
  }
}
