import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {ProprietaireService} from '@core/services/proprietaire.service';
import {Proprietaire} from '@core/models/proprietaire.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-detail-proprietaire',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="md:flex md:items-center md:justify-between">
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl font-bold text-gray-900">
                Détails du Propriétaire
              </h1>
              <p class="mt-1 text-sm text-gray-500">
                Visualisation et gestion d'un propriétaire
              </p>
            </div>
            <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <button type="button" (click)="goBack()"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <i class="fas fa-arrow-left -ml-1 mr-2"></i>
                Retour
              </button>
              <button type="button" [routerLink]="['/admin/proprietaires/edit', proprietaireId]"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <i class="fas fa-edit -ml-1 mr-2"></i>
                Modifier
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div *ngIf="isLoading" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>

        <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {{ error }}
        </div>

        <div *ngIf="proprietaire && !isLoading" class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Information du propriétaire
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Détails personnels et contact
              </p>
            </div>
            <span [class]="getStatusClass(proprietaire.status)"
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
              {{ formatStatus(proprietaire.status) }}
            </span>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Nom complet
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ proprietaire.prenom }} {{ proprietaire.nom }}
                </dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Email
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ proprietaire.email }}
                </dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Téléphone
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ proprietaire.telephone }}
                </dd>
              </div>
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Date d'inscription
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ formatDate(proprietaire.dateCreation) }}
                </dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">
                  Adresse
                </dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ proprietaire.adresse || 'Non spécifiée' }}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Liste des appartements -->
        <div *ngIf="proprietaire && !isLoading" class="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Appartements
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Appartements possédés par ce propriétaire
            </p>
          </div>
          <div class="border-t border-gray-200">
            <div *ngIf="proprietaire.appartements && proprietaire.appartements.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Immeuble
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étage
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Surface
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let appartement of proprietaire.appartements" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ appartement.numero }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ appartement.immeuble?.nom || 'Non spécifié' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ appartement.etage || 'Non spécifié' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ appartement.surface ? appartement.surface + ' m²' : 'Non spécifiée' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a [routerLink]="['/appartements', appartement.id]"
                       class="text-indigo-600 hover:text-indigo-900">
                      Détails
                    </a>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div *ngIf="!proprietaire.appartements || proprietaire.appartements.length === 0"
                 class="text-center py-8">
              <i class="fas fa-home text-gray-400 text-4xl mb-2"></i>
              <p class="text-sm text-gray-500">Ce propriétaire ne possède aucun appartement</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DetailProprietaireComponent implements OnInit {
  proprietaire: Proprietaire | null = null;
  proprietaireId: number = 0;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proprietaireService: ProprietaireService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.proprietaireId = +id;
        this.loadProprietaire();
      }
    });
  }

  loadProprietaire(): void {
    this.isLoading = true;
    this.error = null;

    this.proprietaireService.getProprietaireById(this.proprietaireId)
      .subscribe({
        next: (data) => {
          this.proprietaire = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du propriétaire:', err);
          this.error = 'Impossible de charger les détails du propriétaire. Veuillez réessayer.';
          this.isLoading = false;
        }
      });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Non spécifiée';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  formatStatus(status: string | undefined): string {
    if (!status) return 'Inconnu';

    switch (status.toUpperCase()) {
      case 'ACTIF':
        return 'Actif';
      case 'INACTIF':
        return 'Inactif';
      default:
        return status;
    }
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'bg-gray-100 text-gray-800';

    switch (status.toUpperCase()) {
      case 'ACTIF':
        return 'bg-green-100 text-green-800';
      case 'INACTIF':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/proprietaires']);
  }
}
