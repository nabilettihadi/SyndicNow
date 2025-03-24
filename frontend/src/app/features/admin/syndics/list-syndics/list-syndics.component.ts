import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SyndicService } from '@core/services/syndic.service';
import { Syndic } from '@core/models/syndic.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-syndics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 class="text-2xl font-bold text-gray-900">Gestion des Syndics</h1>
          <p class="mt-1 text-sm text-gray-500">Liste des syndics</p>
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

        <!-- Liste des syndics -->
        <div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immeubles</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let syndic of syndics">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ syndic.nom }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ syndic.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ syndic.telephone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ syndic.nombreImmeubles || 0 }} immeubles</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <button [routerLink]="['/admin/syndics', syndic.id]"
                        class="text-blue-600 hover:text-blue-900">
                  <i class="fas fa-eye"></i>
                </button>
                <button (click)="supprimerSyndic(syndic)"
                        class="text-red-600 hover:text-red-900">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Message si aucun syndic -->
        <div *ngIf="!isLoading && syndics.length === 0" class="text-center py-12">
          <i class="fas fa-users text-gray-400 text-5xl mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900">Aucun syndic trouvé</h3>
        </div>
      </main>
    </div>
  `
})
export class ListSyndicsComponent implements OnInit {
  syndics: Syndic[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private syndicService: SyndicService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSyndics();
  }

  loadSyndics(): void {
    this.isLoading = true;
    this.syndicService.getAllSyndics().subscribe({
      next: (data) => {
        this.syndics = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des syndics:', error);
        this.error = 'Une erreur est survenue lors du chargement des syndics';
        this.isLoading = false;
      }
    });
  }

  supprimerSyndic(syndic: Syndic): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le syndic ${syndic.nom} ?`)) {
      this.syndicService.deleteSyndic(syndic.id).subscribe({
        next: () => {
          this.syndics = this.syndics.filter(s => s.id !== syndic.id);
          this.toastr.success('Le syndic a été supprimé avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du syndic:', error);
          this.toastr.error('Une erreur est survenue lors de la suppression du syndic');
        }
      });
    }
  }
}
