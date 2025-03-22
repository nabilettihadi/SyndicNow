import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ImmeubleService } from '@core/services/immeuble.service';
import { AppartementService } from '@core/services/appartement.service';
import { Immeuble } from '@core/models/immeuble.model';
import { Appartement } from '@core/models/appartement.model';
import { SyndicService } from '@core/services/syndic.service';
import { Syndic } from '@core/models/syndic.model';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-immeuble-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Header avec actions -->
      <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <div class="flex items-center gap-2">
            <button routerLink="/admin/immeubles" class="text-blue-600 hover:text-blue-800">
              <i class="fas fa-arrow-left"></i>
            </button>
            <h1
              class="text-2xl font-bold">{{ immeuble?.nom || 'Détails de l\'immeuble'}}</h1>
            <span *ngIf="immeuble?.status" [ngClass]="getStatusClass(immeuble?.status || '')"
                  class="ml-2 px-3 py-1 text-xs rounded-full">
              {{ immeuble?.status }}
            </span>
          </div>
          <p class="text-gray-600 mt-1">{{ immeuble?.adresse }}, {{ immeuble?.ville }}</p>
        </div>

        <div class="flex gap-3">
          <button *ngIf="immeuble?.id" [routerLink]="['/admin/immeubles', immeuble?.id, 'modifier']"
                  class="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg flex items-center gap-2">
            <i class="fas fa-edit"></i>
            <span>Modifier</span>
          </button>
          <button *ngIf="immeuble?.id" [routerLink]="['/admin/immeubles', immeuble?.id, 'appartements']"
                  class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2">
            <i class="fas fa-home"></i>
            <span>Gérer les appartements</span>
          </button>
        </div>
      </div>

      <!-- Indicateur de chargement -->
      <div *ngIf="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- Message d'erreur -->
      <div *ngIf="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
        <div class="flex items-center">
          <div class="py-1">
            <i class="fas fa-exclamation-circle mr-2"></i>
          </div>
          <div>{{ error }}</div>
        </div>
        <div class="mt-4">
          <button (click)="loadImmeuble(immeuble?.id || 0)" class="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded">
            Réessayer
          </button>
        </div>
      </div>

      <!-- Contenu principal -->
      <div *ngIf="!isLoading && !error && immeuble" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Informations générales -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Carte d'informations générales -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
              <h2 class="text-white text-lg font-semibold">Informations générales</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="text-gray-500 text-sm">Nom</h3>
                  <p class="font-medium">{{ immeuble.nom }}</p>
                </div>
                <div>
                  <h3 class="text-gray-500 text-sm">ID</h3>
                  <p class="font-medium">{{ immeuble.id }}</p>
                </div>
                <div>
                  <h3 class="text-gray-500 text-sm">Année de construction</h3>
                  <p class="font-medium">{{ immeuble.dateConstruction ? (immeuble.dateConstruction | date:'yyyy') : 'Non spécifiée' }}</p>
                </div>
                <div>
                  <h3 class="text-gray-500 text-sm">Nombre d'appartements</h3>
                  <p class="font-medium">{{ immeuble.nombreAppartements || 0 }}</p>
                </div>
                <div>
                  <h3 class="text-gray-500 text-sm">Adresse</h3>
                  <p class="font-medium">{{ immeuble.adresse }}</p>
                </div>
                <div>
                  <h3 class="text-gray-500 text-sm">Code postal et ville</h3>
                  <p class="font-medium">{{ immeuble.codePostal }} {{ immeuble.ville }}</p>
                </div>
                <div>
                  <h3 class="text-gray-500 text-sm">Date de création</h3>
                  <p class="font-medium">Non disponible</p>
                </div>
                <div>
                  <h3 class="text-gray-500 text-sm">Dernière mise à jour</h3>
                  <p class="font-medium">Non disponible</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Liste des appartements -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4 flex justify-between items-center">
              <h2 class="text-white text-lg font-semibold">Appartements</h2>
              <span class="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
                {{ appartements.length || 0 }} appartements
              </span>
            </div>

            <div *ngIf="isLoadingAppartements" class="flex justify-center items-center p-10">
              <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
            </div>

            <div *ngIf="!isLoadingAppartements && appartementsError" class="p-6 text-center">
              <p class="text-red-600">{{ appartementsError }}</p>
              <button (click)="loadAppartements()"
                      class="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded">
                Réessayer
              </button>
            </div>

            <div *ngIf="!isLoadingAppartements && !appartementsError && appartements.length === 0"
                 class="p-10 text-center">
              <div class="text-gray-400 mb-3">
                <i class="fas fa-home text-4xl"></i>
              </div>
              <p class="text-gray-600">Aucun appartement trouvé pour cet immeuble</p>
              <button
                *ngIf="immeuble.id"
                [routerLink]="['/admin/immeubles', immeuble.id, 'appartements', 'nouveau']"
                class="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
              >
                <i class="fas fa-plus mr-2"></i>Ajouter un appartement
              </button>
            </div>

            <div *ngIf="!isLoadingAppartements && !appartementsError && appartements.length > 0"
                 class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                <tr>
                  <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étage
                  </th>
                  <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Surface
                  </th>
                  <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loyer
                  </th>
                  <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propriétaire
                  </th>
                  <th scope="col"
                      class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let appartement of appartements" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ appartement.numero }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ appartement.etage }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ appartement.surface }} m²</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ appartement.loyer | currency:'EUR' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                      <span [ngClass]="getAppartementStatusClass(appartement.status)"
                            class="px-2 py-1 text-xs rounded-full">
                        {{ appartement.status }}
                      </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div *ngIf="appartement.proprietaireId" class="text-sm text-gray-900">
                      Propriétaire #{{ appartement.proprietaireId }}
                    </div>
                    <div *ngIf="!appartement.proprietaireId" class="text-sm text-red-500">
                      Non assigné
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button [routerLink]="['/admin/appartements', appartement.id]"
                            class="text-blue-600 hover:text-blue-900 mr-3">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button [routerLink]="['/admin/appartements', appartement.id, 'modifier']"
                            class="text-amber-600 hover:text-amber-900">
                      <i class="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>

              <div class="p-4 bg-gray-50 border-t border-gray-200">
                <button
                  *ngIf="immeuble.id"
                  [routerLink]="['/admin/immeubles', immeuble.id, 'appartements', 'nouveau']"
                  class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                >
                  <i class="fas fa-plus mr-2"></i>Ajouter un appartement
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-8">
          <!-- Carte du syndic -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4">
              <h2 class="text-white text-lg font-semibold">Syndic assigné</h2>
            </div>
            <div class="p-6">
              <div *ngIf="immeuble.syndic" class="space-y-4">
                <div class="flex items-center">
                  <div class="bg-purple-100 p-3 rounded-full">
                    <i class="fas fa-user-tie text-purple-600 text-xl"></i>
                  </div>
                  <div class="ml-4">
                    <h3 class="font-medium">{{ immeuble.syndic.nom }}</h3>
                    <div class="text-sm text-gray-500">Coordonnées non disponibles</div>
                  </div>
                </div>

                <div class="border-t border-gray-200 pt-4">
                  <h4 class="text-sm text-gray-500 mb-2">Téléphone</h4>
                  <div>Non spécifié</div>
                </div>

                <div class="border-t border-gray-200 pt-4">
                  <h4 class="text-sm text-gray-500 mb-2">Localisation</h4>
                  <div>Non spécifiée</div>
                </div>
              </div>

              <div *ngIf="!immeuble.syndic" class="text-center p-4">
                <div class="bg-gray-100 p-3 rounded-full inline-block mb-2">
                  <i class="fas fa-user-slash text-gray-500 text-xl"></i>
                </div>
                <p class="text-gray-600">Aucun syndic assigné</p>
                <button
                  class="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                >
                  Assigner un syndic
                </button>
              </div>
            </div>
          </div>

          <!-- Statistiques des appartements -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
              <h2 class="text-white text-lg font-semibold">Statistiques des appartements</h2>
            </div>
            <div class="p-6">
              <div *ngIf="isLoadingAppartements" class="text-center p-4">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              </div>

              <div *ngIf="!isLoadingAppartements && !appartementsError">
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div class="bg-blue-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-blue-600">{{ getTotalAppartements() }}</div>
                    <div class="text-sm text-gray-600">Total</div>
                  </div>
                  <div class="bg-green-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-600">{{ getOccupiedAppartements() }}</div>
                    <div class="text-sm text-gray-600">Occupés</div>
                  </div>
                  <div class="bg-yellow-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-yellow-600">{{ getFreeAppartements() }}</div>
                    <div class="text-sm text-gray-600">Disponibles</div>
                  </div>
                  <div class="bg-red-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-red-600">{{ getMaintenanceAppartements() }}</div>
                    <div class="text-sm text-gray-600">En maintenance</div>
                  </div>
                </div>

                <div *ngIf="appartements.length > 0">
                  <h3 class="text-sm font-medium text-gray-500 mb-2">Répartition des statuts</h3>

                  <div *ngIf="getOccupancyRate() > 0" class="mb-2">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-xs text-gray-600">Taux d'occupation</span>
                      <span class="text-xs font-medium">{{ getOccupancyRate() }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-green-600 h-2 rounded-full" [style.width.%]="getOccupancyRate()"></div>
                    </div>
                  </div>

                  <div *ngIf="getAvailabilityRate() > 0" class="mb-2">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-xs text-gray-600">Taux de disponibilité</span>
                      <span class="text-xs font-medium">{{ getAvailabilityRate() }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-yellow-500 h-2 rounded-full" [style.width.%]="getAvailabilityRate()"></div>
                    </div>
                  </div>

                  <div *ngIf="getMaintenanceRate() > 0">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-xs text-gray-600">Taux en maintenance</span>
                      <span class="text-xs font-medium">{{ getMaintenanceRate() }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-red-500 h-2 rounded-full" [style.width.%]="getMaintenanceRate()"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ImmeubleDetailsComponent implements OnInit {
  immeuble: Immeuble | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  appartements: Appartement[] = [];
  isLoadingAppartements: boolean = false;
  appartementsError: string | null = null;

  // Suppression d'immeuble
  showDeleteModal: boolean = false;
  isDeleting: boolean = false;
  
  // Gestion du syndic
  showSyndicModal: boolean = false;
  availableSyndics: Syndic[] = [];
  selectedSyndicId: number | null = null;
  isLoadingSyndics: boolean = false;
  isSavingSyndic: boolean = false;
  syndicError: string | null = null;

  // Ajouter une propriété pour indiquer si des données de secours sont utilisées
  usingMockData: boolean = false;

  private toastr = inject(ToastrService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private immeubleService: ImmeubleService,
    private syndicService: SyndicService,
    private appartementService: AppartementService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadImmeuble(id);
      } else {
        this.error = "Identifiant d'immeuble invalide";
        this.isLoading = false;
      }
    });
  }

  loadImmeuble(id: number): void {
    this.isLoading = true;
    this.error = '';
    
    this.immeubleService.getImmeubleById(id).subscribe({
      next: (immeuble) => {
        this.immeuble = immeuble;
        this.isLoading = false;
        this.loadAppartements();
      },
      error: (error) => {
        console.error(`Erreur lors du chargement de l'immeuble ${id}:`, error);
        this.error = `Impossible de charger les détails de l'immeuble. ${error.status === 0 
          ? 'Le serveur ne répond pas.' 
          : `Erreur ${error.status}: ${error.statusText || 'Erreur inconnue'}`}`;
        this.isLoading = false;
      }
    });
  }

  loadAppartements(): void {
    if (!this.immeuble || !this.immeuble.id) {
      this.appartementsError = 'Impossible de charger les appartements: ID d\'immeuble non disponible';
      return;
    }
    
    this.isLoadingAppartements = true;
    this.appartementsError = '';
    this.usingMockData = false;
    
    const immeubleId = this.immeuble.id;
    console.log(`Chargement des appartements pour l'immeuble ${immeubleId}`);
    
    this.appartementService.getAppartementsByImmeuble(immeubleId).subscribe({
      next: (data) => {
        this.appartements = data;
        this.isLoadingAppartements = false;
        console.log(`${this.appartements.length} appartements chargés`);
        
        // Vérifier si nous utilisons des données fictives (via le service)
        if (data.length > 0 && (data as any[])[0]?.mockData === true) {
          this.usingMockData = true;
        }
      },
      error: (error) => {
        this.isLoadingAppartements = false;
        console.error(`Erreur lors du chargement des appartements pour l'immeuble ${immeubleId}:`, error);
        
        // Si le service n'a pas déjà fourni des données de secours, générer des données fictives ici
        if (error.status === 500) {
          this.appartementsError = "Le serveur a rencontré un problème lors du chargement des appartements.";
          this.appartements = this.getMockAppartements();
          this.usingMockData = true;
          console.log("Utilisation de données fictives pour les appartements");
        } else {
          this.appartementsError = error.message || "Impossible de charger les appartements";
        }
      }
    });
  }

  // Méthode pour générer des données fictives d'appartements en cas d'erreur
  private getMockAppartements(): any[] {
    return Array(5).fill(0).map((_, index) => ({
      id: index + 1,
      numero: `A${index + 101}`,
      etage: Math.floor(index / 2) + 1,
      surface: Math.floor(Math.random() * 50) + 30,
      nombrePieces: Math.floor(Math.random() * 3) + 1,
      status: index % 3 === 0 ? 'OCCUPÉ' : 'LIBRE',
      proprietaireId: index % 2 === 0 ? 1 : 2,
      proprietaireNom: index % 2 === 0 ? 'John Doe' : 'Jane Smith'
    }));
  }

  getTotalAppartements(): number {
    return this.appartements.length;
  }

  getOccupiedAppartements(): number {
    return this.appartements.filter(app => app.status === 'OCCUPE').length;
  }

  getFreeAppartements(): number {
    return this.appartements.filter(app => app.status === 'LIBRE').length;
  }

  getMaintenanceAppartements(): number {
    return this.appartements.filter(app => app.status === 'EN_TRAVAUX').length;
  }

  getOccupancyRate(): number {
    if (this.appartements.length === 0) return 0;
    return (this.getOccupiedAppartements() / this.appartements.length) * 100;
  }

  getAvailabilityRate(): number {
    if (this.appartements.length === 0) return 0;
    return (this.getFreeAppartements() / this.appartements.length) * 100;
  }

  getMaintenanceRate(): number {
    if (this.appartements.length === 0) return 0;
    return (this.getMaintenanceAppartements() / this.appartements.length) * 100;
  }

  // Méthodes utilitaires
  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIF':
        return 'bg-green-100 text-green-800';
      case 'EN_TRAVAUX':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIF':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getAppartementStatusClass(status: string): string {
    switch (status) {
      case 'OCCUPE':
        return 'bg-green-100 text-green-800';
      case 'LIBRE':
        return 'bg-blue-100 text-blue-800';
      case 'EN_TRAVAUX':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Gestion de la suppression
  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  deleteImmeuble(): void {
    if (!this.immeuble) return;
    
    this.isDeleting = true;
    
    this.immeubleService.deleteImmeuble(this.immeuble.id).subscribe({
      next: () => {
        this.toastr.success(`L'immeuble "${this.immeuble?.nom}" a été supprimé avec succès.`);
        this.router.navigate(['/admin/immeubles']);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l\'immeuble', err);
        this.toastr.error('Impossible de supprimer l\'immeuble. Veuillez réessayer plus tard.');
        this.isDeleting = false;
        this.showDeleteModal = false;
      }
    });
  }

  // Gestion du syndic
  assignerSyndic(): void {
    this.isLoadingSyndics = true;
    this.syndicError = null;
    this.selectedSyndicId = null;
    this.showSyndicModal = true;
    
    this.syndicService.getAllSyndics().subscribe({
      next: (data) => {
        this.availableSyndics = data.filter(s => s.status === 'ACTIF');
        this.isLoadingSyndics = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des syndics', err);
        this.syndicError = 'Impossible de charger la liste des syndics disponibles.';
        this.isLoadingSyndics = false;
      }
    });
  }

  confirmAssignerSyndic(): void {
    if (!this.immeuble || !this.selectedSyndicId) return;
    
    this.isSavingSyndic = true;
    
    this.immeubleService.assignerSyndicImmeuble(this.immeuble.id, this.selectedSyndicId).subscribe({
      next: (data) => {
        this.immeuble = data;
        this.toastr.success('Le syndic a été assigné avec succès à l\'immeuble.');
        this.cancelSyndicModal();
      },
      error: (err) => {
        console.error('Erreur lors de l\'assignation du syndic', err);
        this.syndicError = 'Impossible d\'assigner le syndic à l\'immeuble.';
        this.isSavingSyndic = false;
      }
    });
  }

  retirerSyndic(): void {
    if (!this.immeuble || !this.immeuble.syndic) return;
    
    this.isSavingSyndic = true;
    
    this.immeubleService.retirerSyndicImmeuble(this.immeuble.id).subscribe({
      next: (data) => {
        this.immeuble = data;
        this.toastr.success('Le syndic a été retiré avec succès de l\'immeuble.');
        this.isSavingSyndic = false;
      },
      error: (err) => {
        console.error('Erreur lors du retrait du syndic', err);
        this.toastr.error('Impossible de retirer le syndic de l\'immeuble.');
        this.isSavingSyndic = false;
      }
    });
  }

  cancelSyndicModal(): void {
    this.showSyndicModal = false;
    this.selectedSyndicId = null;
    this.syndicError = null;
    this.isSavingSyndic = false;
  }

  // Gestion des appartements
  ajouterAppartement(): void {
    // TODO: Implémenter l'ajout d'appartement
    this.toastr.info('La fonctionnalité d\'ajout d\'appartement sera disponible prochainement.');
  }
}
