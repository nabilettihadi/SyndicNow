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
  templateUrl: './create-immeuble.component.html'
})
export class CreateImmeubleComponent implements OnInit {
  immeubleForm!: FormGroup;
  syndics: Syndic[] = [];
  submitted: boolean = false;
  isSubmitting: boolean = false;
  isLoadingSyndics: boolean = false;
  error: string = '';
  success: string = '';
  
  constructor(
    private fb: FormBuilder,
    private immeubleService: ImmeubleService,
    private syndicService: SyndicService,
    private router: Router
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.immeubleForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      ville: ['', [Validators.required]],
      codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      nombreEtages: [1, [Validators.required, Validators.min(1)]],
      nombreAppartements: [1, [Validators.required, Validators.min(1)]],
      anneeConstruction: [null],
      description: ['', [Validators.maxLength(1000)]],
      syndicId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    console.log('Initialisation du composant CreateImmeubleComponent');
    this.loadSyndics();
  }

  loadSyndics(): void {
    console.log('Début du chargement des syndics');
    this.isLoadingSyndics = true;
    this.error = '';

    this.syndicService.getAllSyndics().subscribe({
      next: (syndics) => {
        console.log('Syndics reçus du serveur:', syndics);
        // Ne filtrer que si le statut existe
        this.syndics = syndics.filter(syndic => !syndic.status || syndic.status === 'ACTIF');
        console.log('Syndics filtrés (actifs):', this.syndics);
        this.isLoadingSyndics = false;
        
        if (this.syndics.length === 0) {
          this.error = 'Aucun syndic actif n\'est disponible.';
        }

        // Si un seul syndic est disponible, le sélectionner automatiquement
        if (this.syndics.length === 1) {
          this.immeubleForm.patchValue({
            syndicId: this.syndics[0].id
          });
        }
      },
      error: (error) => {
        console.error('Erreur détaillée lors du chargement des syndics:', error);
        this.isLoadingSyndics = false;
        this.error = error.message || 'Impossible de charger la liste des syndics.';
        this.syndics = [];
      }
    });
  }

  get f() { 
    return this.immeubleForm.controls; 
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.immeubleForm.invalid) {
      console.log('Formulaire invalide:', this.immeubleForm.errors);
      return;
    }

    this.isSubmitting = true;
    
    // Créer une copie des données du formulaire
    const immeubleData = { ...this.immeubleForm.value };
    
    // Conversion de syndicId en nombre
    if (immeubleData.syndicId) {
      immeubleData.syndicId = Number(immeubleData.syndicId);
    }

    // Conversion de l'année en nombre si elle est définie
    if (immeubleData.anneeConstruction) {
      immeubleData.anneeConstruction = Number(immeubleData.anneeConstruction);
    }

    console.log('Données à envoyer:', immeubleData);

    this.immeubleService.createImmeuble(immeubleData).subscribe({
      next: (result) => {
        console.log('Immeuble créé:', result);
        this.isSubmitting = false;
        this.success = `L'immeuble ${result.nom} a été créé avec succès.`;
        
        // Redirection après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/admin/immeubles', result.id]);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Erreur détaillée:', error);
        if (error.error?.message) {
          this.error = `Erreur: ${error.error.message}`;
        } else {
          this.error = 'Une erreur est survenue lors de la création de l\'immeuble.';
        }
      }
    });
  }

  resetForm(): void {
    this.submitted = false;
    this.error = '';
    this.success = '';
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