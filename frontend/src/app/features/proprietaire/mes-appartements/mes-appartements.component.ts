import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AppartementService} from '@core/services/appartement.service';
import {ImmeubleService} from '@core/services/immeuble.service';
import {AuthService} from '@core/services/auth.service';
import {finalize} from 'rxjs';
import {AppartementDetails} from '@core/models/appartement.model';
import {Immeuble} from '@core/models/immeuble.model';

@Component({
  selector: 'app-mes-appartements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mes-appartements.component.html'
})
export class MesAppartementsComponent implements OnInit {
  appartements: AppartementDetails[] = [];
  immeubles: Immeuble[] = [];
  isLoading = false;
  error: string | null = null;
  showForm = false;
  appartementForm: FormGroup;

  constructor(
    private appartementService: AppartementService,
    private immeubleService: ImmeubleService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.appartementForm = this.fb.group({
      numero: ['', [Validators.required, Validators.maxLength(10)]],
      etage: [0, [Validators.required, Validators.min(-5), Validators.max(100)]],
      superficie: [0, [Validators.required, Validators.min(1), Validators.max(1000)]],
      nombrePieces: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      description: [''],
      immeubleId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAppartements();
    this.loadImmeubles();
  }

  private loadAppartements(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.userId) {
      this.error = "Erreur d'identification de l'utilisateur";
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.appartementService.getAppartementsProprietaire(currentUser.userId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.appartements = data;
        },
        error: (err) => {
          this.error = `Erreur lors du chargement des appartements: ${err.message}`;
        }
      });
  }

  private loadImmeubles(): void {
    this.isLoading = true;
    this.immeubleService.getAllImmeubles()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          console.log('Immeubles chargés:', data);
          this.immeubles = data;
          if (this.immeubles.length === 0) {
            this.error = 'Aucun immeuble disponible';
          }
        },
        error: (err) => {
          console.error('Erreur lors du chargement des immeubles:', err);
          this.error = `Erreur lors du chargement des immeubles: ${err.message}`;
        }
      });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.appartementForm.reset({
      numero: '',
      etage: 0,
      superficie: 0,
      nombrePieces: 1,
      description: '',
      immeubleId: null
    });
  }

  onSubmit(): void {
    if (this.appartementForm.invalid) {
      this.appartementForm.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.userId) {
      this.error = "Erreur d'identification de l'utilisateur";
      return;
    }

    const formData = this.appartementForm.value;
    console.log('Données du formulaire:', formData);
    console.log('immeubleId:', formData.immeubleId);

    // S'assurer que immeubleId est un nombre
    formData.immeubleId = Number(formData.immeubleId);

    // Vérifier que l'immeuble existe
    const selectedImmeuble = this.immeubles.find(i => i.id === formData.immeubleId);
    if (!selectedImmeuble) {
      this.error = "L'immeuble sélectionné n'existe pas";
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.appartementService.createAppartementForProprietaire(currentUser.userId, formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.loadAppartements();
          this.toggleForm();
        },
        error: (err) => {
          this.error = `Erreur lors de l'ajout de l'appartement: ${err.message}`;
        }
      });
  }
}
