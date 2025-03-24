import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {ImmeubleService} from '@core/services/immeuble.service';
import {SyndicService} from '@core/services/syndic.service';
import {Immeuble} from '@core/models/immeuble.model';
import {Syndic} from '@core/models/syndic.model';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-edit-immeuble',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-immeuble.component.html'
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
      anneeConstruction: [null, Validators.required],
      nombreEtages: [1, [Validators.required, Validators.min(1)]],
      syndicId: [null, Validators.required]
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
      anneeConstruction: immeuble.anneeConstruction || new Date().getFullYear(),
      nombreEtages: immeuble.nombreEtages,
      syndicId: immeuble.syndicId
    });

    console.log('Formulaire après initialisation:', this.immeubleForm.value);
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

    const formValue = this.immeubleForm.value;
    console.log('Valeurs du formulaire:', formValue);

    let anneeConstruction = formValue.anneeConstruction;

    // Si l'année de construction n'est pas définie mais la date l'est, calculer l'année
    if (!anneeConstruction && formValue.dateConstruction) {
      anneeConstruction = new Date(formValue.dateConstruction).getFullYear();
    }

    // Si aucune année n'est définie, utiliser l'année actuelle
    if (!anneeConstruction) {
      anneeConstruction = new Date().getFullYear();
    }

    const immeubleData = {
      ...formValue,
      syndicId: this.immeuble?.syndicId,
      anneeConstruction: anneeConstruction
    };

    console.log('Données envoyées au service:', immeubleData);

    // Transformation de la date si nécessaire
    if (immeubleData.dateConstruction) {
      immeubleData.dateConstruction = new Date(immeubleData.dateConstruction);
    }

    this.immeubleService.updateImmeuble(this.immeubleId, immeubleData).subscribe({
      next: (result) => {
        console.log('Réponse du service:', result);
        this.isSubmitting = false;
        this.success = `L'immeuble ${result.nom} a été mis à jour avec succès.`;
        this.immeuble = result;
        // Recharger le formulaire avec les données mises à jour
        this.populateForm(result);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de l\'immeuble:', error);
        this.isSubmitting = false;
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
