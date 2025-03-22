import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ImmeubleService } from '@core/services/immeuble.service';
import { SyndicService } from '@core/services/syndic.service';
import { Syndic } from '@core/models/syndic.model';

@Component({
  selector: 'app-create-immeuble',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="md:flex md:items-center md:justify-between">
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl font-bold text-gray-900">
                Ajouter un nouvel immeuble
              </h1>
              <p class="mt-1 text-sm text-gray-500">
                Créez et enregistrez un nouvel immeuble dans le système
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

      <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <form [formGroup]="immeubleForm" (ngSubmit)="onSubmit()">
              <!-- Alerte d'erreur -->
              <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                {{ error }}
              </div>
              
              <!-- Succès -->
              <div *ngIf="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                {{ success }}
              </div>

              <!-- Nom de l'immeuble -->
              <div class="mb-4">
                <label for="nom" class="block text-sm font-medium text-gray-700">Nom de l'immeuble *</label>
                <input type="text" id="nom" formControlName="nom"
                       class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                       placeholder="Ex: Résidence Les Lilas">
                <div *ngIf="submitted && f['nom'].errors" class="text-red-500 text-xs mt-1">
                  <span *ngIf="f['nom'].errors['required']">Le nom de l'immeuble est requis</span>
                </div>
              </div>

              <!-- Adresse -->
              <div class="mb-4">
                <label for="adresse" class="block text-sm font-medium text-gray-700">Adresse *</label>
                <input type="text" id="adresse" formControlName="adresse"
                       class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                       placeholder="Ex: 15 Rue de la Paix">
                <div *ngIf="submitted && f['adresse'].errors" class="text-red-500 text-xs mt-1">
                  <span *ngIf="f['adresse'].errors['required']">L'adresse est requise</span>
                </div>
              </div>

              <!-- Code postal et ville -->
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                <div>
                  <label for="codePostal" class="block text-sm font-medium text-gray-700">Code postal *</label>
                  <input type="text" id="codePostal" formControlName="codePostal"
                         class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                         placeholder="Ex: 75001">
                  <div *ngIf="submitted && f['codePostal'].errors" class="text-red-500 text-xs mt-1">
                    <span *ngIf="f['codePostal'].errors['required']">Le code postal est requis</span>
                  </div>
                </div>
                <div>
                  <label for="ville" class="block text-sm font-medium text-gray-700">Ville *</label>
                  <input type="text" id="ville" formControlName="ville"
                         class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                         placeholder="Ex: Paris">
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
                         class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                         placeholder="Ex: 5">
                  <div *ngIf="submitted && f['nombreEtages'].errors" class="text-red-500 text-xs mt-1">
                    <span *ngIf="f['nombreEtages'].errors['required']">Le nombre d'étages est requis</span>
                    <span *ngIf="f['nombreEtages'].errors['min']">Le nombre d'étages doit être au moins 1</span>
                  </div>
                </div>
              </div>

              <!-- Nombre d'appartements -->
              <div class="mb-4">
                <label for="nombreAppartements" class="block text-sm font-medium text-gray-700">Nombre d'appartements *</label>
                <input type="number" id="nombreAppartements" formControlName="nombreAppartements" min="1"
                       class="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                       placeholder="Ex: 100">
                <div *ngIf="submitted && f['nombreAppartements'].errors" class="text-red-500 text-xs mt-1">
                  <span *ngIf="f['nombreAppartements'].errors['required']">Le nombre d'appartements est requis</span>
                  <span *ngIf="f['nombreAppartements'].errors['min']">Le nombre d'appartements doit être au moins 1</span>
                </div>
              </div>

              <!-- Syndic -->
              <div class="mb-6">
                <label for="syndicId" class="block text-sm font-medium text-gray-700">Syndic</label>
                <select id="syndicId" formControlName="syndicId"
                        class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                  <option [ngValue]="null">Sélectionnez un syndic (optionnel)</option>
                  <option *ngFor="let syndic of syndics" [ngValue]="syndic.id">{{ syndic.nom }}</option>
                </select>
              </div>

              <!-- Boutons de soumission -->
              <div class="flex justify-end space-x-3">
                <button type="button" (click)="resetForm()"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Réinitialiser
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
export class CreateImmeubleComponent implements OnInit {
  immeubleForm: FormGroup;
  syndics: Syndic[] = [];
  submitted: boolean = false;
  isSubmitting: boolean = false;
  error: string = '';
  success: string = '';
  
  constructor(
    private fb: FormBuilder,
    private immeubleService: ImmeubleService,
    private syndicService: SyndicService,
    private router: Router
  ) {
    this.immeubleForm = this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      codePostal: ['', Validators.required],
      ville: ['', Validators.required],
      dateConstruction: [null],
      nombreEtages: [1, [Validators.required, Validators.min(1)]],
      nombreAppartements: [1, [Validators.required, Validators.min(1)]],
      syndicId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSyndics();
  }

  loadSyndics(): void {
    this.syndicService.getAllSyndics().subscribe({
      next: (syndics) => {
        this.syndics = syndics;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des syndics:', error);
        this.error = 'Impossible de charger la liste des syndics.';
      }
    });
  }

  get f() { return this.immeubleForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.immeubleForm.invalid) {
      // Afficher un message plus détaillé pour l'utilisateur
      if (this.f['syndicId'].errors?.['required']) {
        this.error = 'Veuillez sélectionner un syndic pour cet immeuble.';
      } else {
        this.error = 'Veuillez remplir correctement tous les champs obligatoires.';
      }
      return;
    }

    this.isSubmitting = true;
    
    const immeubleData = this.immeubleForm.value;
    
    console.log("Données du formulaire pour création:", immeubleData);

    this.immeubleService.createImmeuble(immeubleData).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.success = `L'immeuble ${result.nom} a été créé avec succès.`;
        this.resetForm();
        // Rediriger vers la page des détails après quelques secondes
        setTimeout(() => {
          this.router.navigate(['/admin/immeubles', result.id]);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Erreur lors de la création de l\'immeuble:', error);
        
        // Afficher un message d'erreur plus spécifique si possible
        if (error.error && error.error.message) {
          this.error = `Erreur: ${error.error.message}`;
        } else if (error.status === 400) {
          this.error = 'Les données soumises sont incorrectes. Veuillez vérifier tous les champs obligatoires.';
        } else {
          this.error = 'Une erreur est survenue lors de la création de l\'immeuble. Veuillez réessayer.';
        }
      }
    });
  }

  resetForm(): void {
    this.submitted = false;
    this.immeubleForm.reset({
      nombreEtages: 1,
      nombreAppartements: 1,
      syndicId: null
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/immeubles']);
  }
} 