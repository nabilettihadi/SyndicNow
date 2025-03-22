import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SyndicService } from '@core/services/syndic.service';
import { ImmeubleService } from '@core/services/immeuble.service';

@Component({
  selector: 'app-syndic-immeubles',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="md:flex md:items-center md:justify-between">
            <div class="flex items-center">
              <button routerLink="/admin/syndics" class="text-primary-600 hover:text-primary-900 mr-2">
                <i class="fas fa-arrow-left"></i>
              </button>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Immeubles gérés par {{syndic?.nom || 'le syndic'}}</h1>
                <p class="mt-1 text-sm text-gray-500">Gestion des immeubles attribués au syndic</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Message d'erreur -->
        <div *ngIf="error" class="rounded-md bg-red-50 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-red-400 text-xl"></i>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Une erreur est survenue</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{error}}</p>
              </div>
              <div class="mt-4">
                <button type="button" (click)="loadSyndicData()"
                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- État du chargement -->
        <div *ngIf="isLoading" class="flex justify-center my-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>

        <div *ngIf="!isLoading && !error">
          <!-- Résumé du syndic -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">Informations du syndic</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Détails et coordonnées</p>
              </div>
              <button routerLink="/admin/syndics/{{syndicId}}/edit" 
                      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                <i class="fas fa-edit mr-2"></i> Modifier
              </button>
            </div>
            <div class="border-t border-gray-200">
              <dl>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Nom du syndic</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{syndic?.nom || 'Non disponible'}}</dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{syndic?.email || 'Non disponible'}}</dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Téléphone</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{syndic?.telephone || 'Non disponible'}}</dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Adresse</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{syndic?.adresse || 'Non disponible'}}</dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Immeubles gérés</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{immeubles.length}}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Liste des immeubles gérés -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">Immeubles gérés</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Liste des propriétés sous la gestion de ce syndic</p>
              </div>
              <button (click)="showAssignImmeubleModal = true" 
                      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                <i class="fas fa-plus mr-2"></i> Assigner un immeuble
              </button>
            </div>

            <!-- Message si aucun immeuble -->
            <div *ngIf="immeubles.length === 0" class="px-4 py-8 text-center">
              <p class="text-gray-500">Aucun immeuble n'est actuellement assigné à ce syndic.</p>
            </div>

            <!-- Liste des immeubles -->
            <div *ngIf="immeubles.length > 0" class="border-t border-gray-200">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let immeuble of immeubles">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{{immeuble.nom}}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500">{{immeuble.adresse}}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500">{{immeuble.ville}}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                              [ngClass]="getStatusClass(immeuble.status)">
                          {{immeuble.status}}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex space-x-2">
                          <a [routerLink]="['/admin/immeubles', immeuble.id]" class="text-primary-600 hover:text-primary-900">
                            <i class="fas fa-eye"></i>
                          </a>
                          <button (click)="unassignImmeuble(immeuble.id)" class="text-red-600 hover:text-red-900">
                            <i class="fas fa-unlink"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class SyndicImmeublesComponent implements OnInit {
  syndicId: number = 0;
  syndic: any = null;
  immeubles: any[] = [];
  availableImmeubles: any[] = [];
  selectedImmeubleId: number | null = null;
  isLoading: boolean = true;
  isAssigningImmeuble: boolean = false;
  error: string | null = null;
  showAssignImmeubleModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private syndicService: SyndicService,
    private immeubleService: ImmeubleService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.syndicId = +params['id'];
        this.loadSyndicData();
      } else {
        this.router.navigate(['/admin/syndics']);
      }
    });
  }

  loadSyndicData(): void {
    this.isLoading = true;
    this.error = null;
    
    // Charger les informations du syndic
    this.syndicService.getSyndicById(this.syndicId).subscribe({
      next: (syndic) => {
        this.syndic = syndic;
        this.loadImmeubles();
      },
      error: (error) => {
        console.error('Erreur lors du chargement du syndic:', error);
        this.error = 'Impossible de charger les informations du syndic. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  loadImmeubles(): void {
    this.syndicService.getSyndicsByImmeuble(this.syndicId).subscribe({
      next: (immeubles) => {
        this.immeubles = immeubles;
        this.loadAvailableImmeubles();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des immeubles:', error);
        this.error = 'Impossible de charger les immeubles gérés. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  loadAvailableImmeubles(): void {
    this.immeubleService.getAllImmeubles().subscribe({
      next: (allImmeubles) => {
        // Filtrer les immeubles qui ne sont pas déjà assignés à ce syndic
        this.availableImmeubles = allImmeubles.filter(immeuble => 
          !this.immeubles.some(i => i.id === immeuble.id)
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des immeubles disponibles:', error);
        this.error = 'Impossible de charger les immeubles disponibles. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  assignImmeuble(): void {
    if (!this.selectedImmeubleId) return;
    
    this.isAssigningImmeuble = true;
    this.syndicService.assignImmeubleToSyndic(this.syndicId, this.selectedImmeubleId).subscribe({
      next: () => {
        this.showAssignImmeubleModal = false;
        this.selectedImmeubleId = null;
        this.isAssigningImmeuble = false;
        this.loadImmeubles();
      },
      error: (error) => {
        console.error('Erreur lors de l\'assignation de l\'immeuble:', error);
        this.error = 'Impossible d\'assigner l\'immeuble au syndic. Veuillez réessayer plus tard.';
        this.isAssigningImmeuble = false;
      }
    });
  }

  unassignImmeuble(immeubleId: number): void {
    if (confirm('Êtes-vous sûr de vouloir retirer cet immeuble de la gestion de ce syndic?')) {
      this.syndicService.removeImmeubleFromSyndic(this.syndicId, immeubleId).subscribe({
        next: () => {
          this.loadImmeubles();
        },
        error: (error) => {
          console.error('Erreur lors du retrait de l\'immeuble:', error);
          this.error = 'Impossible de retirer l\'immeuble du syndic. Veuillez réessayer plus tard.';
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'ACTIF':
        return 'bg-green-100 text-green-800';
      case 'EN_CONSTRUCTION':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIF':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
} 