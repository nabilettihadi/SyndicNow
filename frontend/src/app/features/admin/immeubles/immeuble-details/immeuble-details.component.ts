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

interface ImmeubleStats {
  total: number;
  occupied: number;
  maintenance: number;
  available: number;
  occupancyRate: number;
  availabilityRate: number;
  maintenanceRate: number;
}

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
            <h1 class="text-2xl font-bold">{{ immeuble?.nom }}</h1>
          </div>
          <p class="text-gray-600 mt-1">{{ immeuble?.adresse }}, {{ immeuble?.ville }}</p>
        </div>

        <div class="flex gap-3">
          <button *ngIf="immeuble?.id" 
                  class="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg flex items-center gap-2"
                  (click)="modifierImmeuble()">
            <i class="fas fa-edit"></i>
            <span>Modifier</span>
          </button>
          <button *ngIf="immeuble?.id" 
                  class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2"
                  (click)="gererAppartements()">
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
          <div class="py-1"><i class="fas fa-exclamation-circle mr-2"></i></div>
          <div>{{ error }}</div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div *ngIf="!isLoading && !error && immeuble" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Informations générales -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
              <h2 class="text-white text-lg font-semibold">Informations générales</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-2 gap-6">
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
                  <p class="font-medium">{{ immeuble.dateConstruction || 'Non spécifiée' }}</p>
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
                  <p class="font-medium">{{ immeuble.dateCreation || 'Non disponible' }}</p>
                </div>
                <div>
                  <h3 class="text-gray-500 text-sm">Dernière mise à jour</h3>
                  <p class="font-medium">{{ immeuble.dateModification || 'Non disponible' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-8">
          <!-- Syndic assigné -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4">
              <h2 class="text-white text-lg font-semibold">Syndic assigné</h2>
            </div>
            <div class="p-6">
              <div *ngIf="!immeuble.syndic" class="text-center">
                <div class="text-gray-400 mb-3">
                  <i class="fas fa-user-slash text-4xl"></i>
                </div>
                <p class="text-gray-600">Aucun syndic assigné</p>
                <button (click)="assignerSyndic()"
                        class="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg">
                  Assigner un syndic
                </button>
              </div>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
              <h2 class="text-white text-lg font-semibold">Statistiques des appartements</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-blue-600">{{ appartements.length }}</div>
                  <div class="text-sm text-gray-500">Total</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-green-600">{{ getOccupiedAppartements() }}</div>
                  <div class="text-sm text-gray-500">Occupés</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-yellow-600">{{ getFreeAppartements() }}</div>
                  <div class="text-sm text-gray-500">Disponibles</div>
                </div>
                <div class="text-center p-4 bg-gray-50 rounded-lg">
                  <div class="text-2xl font-bold text-red-600">{{ getMaintenanceAppartements() }}</div>
                  <div class="text-sm text-gray-500">En maintenance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des appartements -->
      <div *ngIf="!isLoading && !error && immeuble" class="mt-8">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4 flex justify-between items-center">
            <h2 class="text-white text-lg font-semibold">Appartements</h2>
            <button *ngIf="immeuble.id" 
                    (click)="ajouterAppartement()"
                    class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <i class="fas fa-plus"></i>
              <span>Ajouter</span>
            </button>
          </div>

          <div *ngIf="isLoadingAppartements" class="flex justify-center items-center p-10">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
          </div>

          <div *ngIf="!isLoadingAppartements && appartements.length === 0" class="p-10 text-center">
            <div class="text-gray-400 mb-3">
              <i class="fas fa-home text-4xl"></i>
            </div>
            <p class="text-gray-600">Aucun appartement trouvé pour cet immeuble</p>
          </div>

          <div *ngIf="!isLoadingAppartements && appartements.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étage</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Surface</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let appartement of appartements">
                  <td class="px-6 py-4 whitespace-nowrap">{{ appartement.numero }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ appartement.etage }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ appartement.surface }} m²</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [ngClass]="getAppartementStatusClass(appartement.status)"
                          class="px-2 py-1 text-xs rounded-full">
                      {{ appartement.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-amber-600 hover:text-amber-900">
                      <i class="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
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

  stats: ImmeubleStats = {
    total: 0,
    occupied: 0,
    maintenance: 0,
    available: 0,
    occupancyRate: 0,
    availabilityRate: 0,
    maintenanceRate: 0
  };

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
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadImmeuble(id);
      }
    });
  }

  loadImmeuble(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.immeubleService.getImmeubleById(id).subscribe({
      next: (data) => {
        this.immeuble = data;
        this.isLoading = false;
        // Charger les appartements après avoir chargé l'immeuble
        this.loadAppartements();
        // Mettre à jour les statistiques
        this.updateStatistics();
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'immeuble:', error);
        this.error = 'Impossible de charger les détails de l\'immeuble';
        this.isLoading = false;
      }
    });
  }

  loadAppartements(): void {
    if (!this.immeuble?.id) return;

    this.isLoadingAppartements = true;
    this.appartementsError = null;

    this.appartementService.getAppartementsByImmeuble(this.immeuble.id).subscribe({
      next: (data) => {
        this.appartements = data;
        this.isLoadingAppartements = false;
        this.updateStatistics();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des appartements:', error);
        this.appartementsError = 'Impossible de charger les appartements';
        this.isLoadingAppartements = false;
      }
    });
  }

  updateStatistics(): void {
    if (!this.immeuble) return;
    
    // Mettre à jour le nombre total d'appartements
    this.immeuble.nombreAppartements = this.appartements.length;
    
    // Calculer les statistiques
    const occupied = this.getOccupiedAppartements();
    const maintenance = this.getMaintenanceAppartements();
    const available = this.getFreeAppartements();
    
    // Mettre à jour l'affichage des statistiques
    this.stats = {
      total: this.appartements.length,
      occupied: occupied,
      maintenance: maintenance,
      available: available,
      occupancyRate: this.getOccupancyRate(),
      availabilityRate: this.getAvailabilityRate(),
      maintenanceRate: this.getMaintenanceRate()
    };
  }

  getOccupiedAppartements(): number {
    return this.appartements.filter(a => a.status === 'OCCUPE').length;
  }

  getFreeAppartements(): number {
    return this.appartements.filter(a => a.status === 'LIBRE').length;
  }

  getMaintenanceAppartements(): number {
    return this.appartements.filter(a => a.status === 'EN_TRAVAUX').length;
  }

  getOccupancyRate(): number {
    return this.appartements.length > 0 
      ? (this.getOccupiedAppartements() / this.appartements.length) * 100 
      : 0;
  }

  getAvailabilityRate(): number {
    return this.appartements.length > 0 
      ? (this.getFreeAppartements() / this.appartements.length) * 100 
      : 0;
  }

  getMaintenanceRate(): number {
    return this.appartements.length > 0 
      ? (this.getMaintenanceAppartements() / this.appartements.length) * 100 
      : 0;
  }

  getTotalAppartements(): number {
    return this.appartements.length;
  }

  // Méthodes utilitaires
  formatDate(date: Date | string | null): string {
    if (!date) return 'Non disponible';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'ACTIF':
        return 'Actif';
      case 'EN_TRAVAUX':
        return 'En travaux';
      case 'INACTIF':
        return 'Inactif';
      default:
        return status;
    }
  }

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
    if (this.immeuble?.id) {
      this.router.navigate(['/admin/immeubles', this.immeuble.id, 'appartements', 'nouveau']);
    }
  }

  modifierImmeuble(): void {
    if (this.immeuble?.id) {
      this.router.navigate(['/admin/immeubles', this.immeuble.id, 'modifier']);
    }
  }

  gererAppartements(): void {
    if (this.immeuble?.id) {
      this.router.navigate(['/admin/immeubles', this.immeuble.id, 'appartements']);
    }
  }
}
