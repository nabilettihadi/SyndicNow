import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SyndicService } from '@core/services/syndic.service';

@Component({
  selector: 'app-add-syndic',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Ajouter un nouveau syndic</h1>
        <button type="button" (click)="cancel()" class="text-gray-600 hover:text-gray-800">
          <i class="fas fa-times"></i> Annuler
        </button>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <form [formGroup]="syndicForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="nom" class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input type="text" id="nom" formControlName="nom" 
                class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500">
              <div *ngIf="syndicForm.get('nom')?.invalid && syndicForm.get('nom')?.touched" 
                class="text-red-500 text-sm mt-1">
                Le nom est requis
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" formControlName="email" 
                class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500">
              <div *ngIf="syndicForm.get('email')?.invalid && syndicForm.get('email')?.touched" 
                class="text-red-500 text-sm mt-1">
                Un email valide est requis
              </div>
            </div>

            <div>
              <label for="telephone" class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input type="tel" id="telephone" formControlName="telephone" 
                class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500">
              <div *ngIf="syndicForm.get('telephone')?.invalid && syndicForm.get('telephone')?.touched" 
                class="text-red-500 text-sm mt-1">
                Un numéro de téléphone valide est requis
              </div>
            </div>

            <div>
              <label for="ville" class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input type="text" id="ville" formControlName="ville" 
                class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500">
              <div *ngIf="syndicForm.get('ville')?.invalid && syndicForm.get('ville')?.touched" 
                class="text-red-500 text-sm mt-1">
                La ville est requise
              </div>
            </div>
          </div>

          <div class="mt-6">
            <button type="submit" [disabled]="syndicForm.invalid" 
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              [class.opacity-50]="syndicForm.invalid">
              Ajouter le syndic
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class AddSyndicComponent implements OnInit {
  syndicForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private syndicService: SyndicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.syndicForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{9,}$/)]],
      ville: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.syndicForm.invalid) {
      return;
    }

    this.syndicService.createSyndic(this.syndicForm.value).subscribe({
      next: () => {
        this.router.navigate(['/admin/syndics']);
      },
      error: (error) => {
        console.error('Erreur lors de la création du syndic:', error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/syndics']);
  }
} 