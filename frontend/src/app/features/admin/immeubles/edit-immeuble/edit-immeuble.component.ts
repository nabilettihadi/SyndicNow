import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ImmeubleService } from '@core/services/immeuble.service';
import { SyndicService } from '@core/services/syndic.service';
import { Immeuble } from '@core/models/immeuble.model';
import { Syndic } from '@core/models/syndic.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-immeuble',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="md:flex md:items-center md:justify-between">
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl font-bold text-gray-900">
                Modifier l'immeuble
              </h1>
              <p class="mt-1 text-sm text-gray-500">
                Modification des informations de l'immeuble
              </p>
            </div>
            <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <button type="button" (click)="goBack()" 
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <i class="fas fa-arrow-left -ml-1 mr-2"></i>
                Retour
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Liste des syndics -->
        <div class="mb-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">Liste des Syndics</h3>
              <p class="mt-1 text-sm text-gray-500">Sélectionnez un syndic pour l'assigner à l'immeuble</p>
            </div>
          </div>

          <div class="border-t border-gray-200">
            <div *ngIf="isLoadingSyndics" class="flex justify-center py-6">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>

            <div *ngIf="!isLoadingSyndics && syndics.length === 0" class="text-center py-6">
              <p class="text-gray-500">Aucun syndic disponible</p>
            </div>

            <ul *ngIf="!isLoadingSyndics && syndics.length > 0" class="divide-y divide-gray-200">
              <li *ngFor="let syndic of syndics" class="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span class="text-primary-600 font-medium">{{syndic.nom.charAt(0)}}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{syndic.nom}}</div>
                      <div class="text-sm text-gray-500">{{syndic.email}}</div>
                      <div class="text-sm text-gray-500">{{syndic.telephone}}</div>
                    </div>
                  </div>
                  <div>
                    <button 
                      (click)="assignerSyndic(syndic.id)"
                      [disabled]="isAssigning"
                      [class.opacity-50]="isAssigning"
                      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      <span *ngIf="isAssigning" class="mr-2">
                        <i class="fas fa-spinner fa-spin"></i>
                      </span>
                      Assigner
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Informations de l'immeuble -->
        <div *ngIf="isLoading" class="flex justify-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
        
        <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {{ error }}
        </div>

        <div *ngIf="!isLoading && !error" class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <form [formGroup]="immeubleForm" (ngSubmit)="onSubmit()">
              <!-- Succès -->
              <div *ngIf="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                {{ success }}
              </div>

              <!-- Nom de l'immeuble -->
              <div class="mb-4">
                <label for="nom" class="block text-sm font-medium text-gray-700">Nom de l'immeuble *</label>
                <input type="text" id="nom" formControlName="nom"
                       class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                <div *ngIf="submitted && f['nom'].errors" class="text-red-500 text-xs mt-1">
                  <span *ngIf="f['nom'].errors['required']">Le nom de l'immeuble est requis</span>
                </div>
              </div>

              <!-- Adresse -->
              <div class="mb-4">
                <label for="adresse" class="block text-sm font-medium text-gray-700">Adresse *</label>
                <input type="text" id="adresse" formControlName="adresse"
                       class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                <div *ngIf="submitted && f['adresse'].errors" class="text-red-500 text-xs mt-1">
                  <span *ngIf="f['adresse'].errors['required']">L'adresse est requise</span>
                </div>
              </div>

              <!-- Code postal et ville -->
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                <div>
                  <label for="codePostal" class="block text-sm font-medium text-gray-700">Code postal *</label>
                  <input type="text" id="codePostal" formControlName="codePostal"
                         class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  <div *ngIf="submitted && f['codePostal'].errors" class="text-red-500 text-xs mt-1">
                    <span *ngIf="f['codePostal'].errors['required']">Le code postal est requis</span>
                  </div>
                </div>
                <div>
                  <label for="ville" class="block text-sm font-medium text-gray-700">Ville *</label>
                  <input type="text" id="ville" formControlName="ville"
                         class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  <div *ngIf="submitted && f['ville'].errors" class="text-red-500 text-xs mt-1">
                    <span *ngIf="f['ville'].errors['required']">La ville est requise</span>
                  </div>
                </div>
              </div>

              <!-- Date de construction et nombre d'étages -->
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                <div>
                  <label for="dateConstruction" class="block text-sm font-medium text-gray-700">Date de construction</label>
                  <input type="date" id="dateConstruction" formControlName="dateConstruction"
                         class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                </div>
                <div>
                  <label for="nombreEtages" class="block text-sm font-medium text-gray-700">Nombre d'étages *</label>
                  <input type="number" id="nombreEtages" formControlName="nombreEtages" min="1"
                         class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  <div *ngIf="submitted && f['nombreEtages'].errors" class="text-red-500 text-xs mt-1">
                    <span *ngIf="f['nombreEtages'].errors['required']">Le nombre d'étages est requis</span>
                    <span *ngIf="f['nombreEtages'].errors['min']">Le nombre d'étages doit être au moins 1</span>
                  </div>
                </div>
              </div>

              <!-- Statut -->
              <div class="mb-4">
                <label for="status" class="block text-sm font-medium text-gray-700">Statut *</label>
                <select id="status" formControlName="status"
                        class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                  <option value="ACTIF">Actif</option>
                  <option value="EN_TRAVAUX">En travaux</option>
                  <option value="INACTIF">Inactif</option>
                </select>
                <div *ngIf="submitted && f['status'].errors" class="text-red-500 text-xs mt-1">
                  <span *ngIf="f['status'].errors['required']">Le statut est requis</span>
                </div>
              </div>

              <!-- Boutons de soumission -->
              <div class="flex justify-end space-x-3">
                <button type="button" (click)="resetForm()"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Annuler
                </button>
                <button type="submit"
                        [disabled]="isSubmitting"
                        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <span *ngIf="isSubmitting" class="mr-2">
                    <i class="fas fa-spinner fa-spin"></i>
                  </span>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  `
})
export class EditImmeubleComponent implements OnInit {
  immeubleForm: FormGroup;
  immeubleId: number = 0;
  immeuble: Immeuble | null = null;
  syndics: Syndic[] = [];
  submitted: boolean = false;
  isSubmitting: boolean = false;
  isLoading: boolean = true;
  isLoadingSyndics: boolean = true;
  isAssigning: boolean = false;
  error: string = '';
  success: string = '';
  
  constructor(
    private fb: FormBuilder,
    private immeubleService: ImmeubleService,
    private syndicService: SyndicService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.immeubleForm = this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      codePostal: ['', Validators.required],
      ville: ['', Validators.required],
      dateConstruction: [null],
      nombreEtages: [1, [Validators.required, Validators.min(1)]],
      status: ['ACTIF', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.immeubleId = +id;
        this.loadImmeuble();
        this.loadSyndics();
      } else {
        this.error = 'Identifiant d\'immeuble non trouvé.';
        this.isLoading = false;
      }
    });
  }

  loadImmeuble(): void {
    this.immeubleService.getImmeubleById(this.immeubleId).subscribe({
      next: (immeuble) => {
        this.immeuble = immeuble;
        this.populateForm(immeuble);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'immeuble:', error);
        this.error = 'Impossible de charger les données de l\'immeuble.';
        this.isLoading = false;
      }
    });
  }

  loadSyndics(): void {
    this.isLoadingSyndics = true;
    this.syndicService.getAllSyndics().subscribe({
      next: (syndics) => {
        this.syndics = syndics;
        this.isLoadingSyndics = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des syndics:', error);
        this.error = 'Impossible de charger la liste des syndics.';
        this.isLoadingSyndics = false;
      }
    });
  }

  populateForm(immeuble: Immeuble): void {
    // Format de la date pour l'input type date (YYYY-MM-DD)
    let dateConstruction = null;
    if (immeuble.dateConstruction) {
      const date = new Date(immeuble.dateConstruction);
      dateConstruction = date.toISOString().split('T')[0];
    }

    this.immeubleForm.patchValue({
      nom: immeuble.nom,
      adresse: immeuble.adresse,
      codePostal: immeuble.codePostal,
      ville: immeuble.ville,
      dateConstruction: dateConstruction,
      nombreEtages: immeuble.nombreEtages,
      status: immeuble.status
    });
  }

  get f() { return this.immeubleForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.immeubleForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    
    const immeubleData = { ...this.immeubleForm.value };
    
    // Transformation de la date si nécessaire
    if (immeubleData.dateConstruction) {
      immeubleData.dateConstruction = new Date(immeubleData.dateConstruction);
    }

    this.immeubleService.updateImmeuble(this.immeubleId, immeubleData).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.success = `L'immeuble ${result.nom} a été mis à jour avec succès.`;
        this.immeuble = result;
        // Recharger le formulaire avec les données mises à jour
        this.populateForm(result);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Erreur lors de la mise à jour de l\'immeuble:', error);
        this.error = 'Une erreur est survenue lors de la mise à jour de l\'immeuble. Veuillez réessayer.';
      }
    });
  }

  resetForm(): void {
    this.submitted = false;
    if (this.immeuble) {
      this.populateForm(this.immeuble);
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/immeubles', this.immeubleId]);
  }

  assignerSyndic(syndicId: number): void {
    if (!this.immeubleId) return;
    
    this.isAssigning = true;
    this.immeubleService.assignerSyndicImmeuble(this.immeubleId, syndicId).subscribe({
      next: (result) => {
        this.immeuble = result;
        this.toastr.success('Le syndic a été assigné avec succès');
        this.isAssigning = false;
        this.loadImmeuble(); // Recharger les données de l'immeuble
      },
      error: (error) => {
        console.error('Erreur lors de l\'assignation du syndic:', error);
        this.toastr.error('Une erreur est survenue lors de l\'assignation du syndic');
        this.isAssigning = false;
      }
    });
  }
} 