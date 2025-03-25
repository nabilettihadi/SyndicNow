import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AppartementService } from '@core/services/appartement.service';
import { ImmeubleService } from '@core/services/immeuble.service';
import { AuthService } from '@core/services/auth.service';
import { finalize } from 'rxjs';
import { AppartementDetails } from '@core/models/appartement.model';
import { Immeuble } from '@core/models/immeuble.model';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-mes-appartements',
  templateUrl: './mes-appartements.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgClass
  ]
})
export class MesAppartementsComponent implements OnInit {
  appartements: AppartementDetails[] = [];
  immeubles: Immeuble[] = [];
  isLoading = false;
  error: string | null = null;
  showForm = false;
  appartementForm: FormGroup;
  proprietaireId: number | null = null;

  constructor(
    private appartementService: AppartementService,
    private immeubleService: ImmeubleService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.appartementForm = this.fb.group({
      numero: ['', [Validators.required, Validators.maxLength(10)]],
      etage: [0, [Validators.required, Validators.min(-5), Validators.max(100)]],
      surface: [null, [Validators.required, Validators.min(1), Validators.max(1000)]],
      nombrePieces: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      description: [''],
      immeubleId: [null, Validators.required]
    });

    // Récupérer l'ID de l'utilisateur connecté
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.userId) {
      this.proprietaireId = currentUser.userId;
    } else {
      this.error = "Erreur d'identification de l'utilisateur";
    }
  }

  ngOnInit(): void {
    if (this.proprietaireId) {
      this.loadAppartements();
      this.loadImmeubles();
    }
  }

  private loadAppartements(): void {
    if (!this.proprietaireId) {
      this.error = "Erreur d'identification de l'utilisateur";
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.appartementService.getAppartementsProprietaire(this.proprietaireId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          console.log('Données reçues du backend:', data);
          this.appartements = data;
          
          if (this.appartements.length === 0) {
            console.log('Aucun appartement trouvé pour cet utilisateur');
          } else {
            console.log('Données stockées dans le composant:', this.appartements);
          }
        },
        error: (err) => {
          console.error('Erreur détaillée:', err);
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
            console.log('Aucun immeuble disponible');
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
      surface: null,
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

    if (!this.proprietaireId) {
      this.error = "Erreur d'identification de l'utilisateur";
      return;
    }

    const formData = {
      ...this.appartementForm.value,
      proprietaireIds: [this.proprietaireId],
      nombrePieces: Number(this.appartementForm.value.nombrePieces),
      immeubleId: Number(this.appartementForm.value.immeubleId),
      etage: Number(this.appartementForm.value.etage),
      surface: Number(this.appartementForm.value.surface)
    };

    console.log('Données du formulaire à envoyer:', formData);

    this.isLoading = true;
    this.error = null;

    this.appartementService.createAppartementForProprietaire(this.proprietaireId, formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.loadAppartements();
          this.toggleForm();
        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
          this.error = `Erreur lors de l'ajout de l'appartement: ${err.message}`;
        }
      });
  }

  editAppartement(appartementId: number): void {
    this.router.navigate(['/proprietaire/appartements', appartementId, 'edit']);
  }

  deleteAppartement(appartementId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet appartement ?')) {
      if (!this.proprietaireId) {
        this.error = "Erreur d'identification de l'utilisateur";
        return;
      }

      this.isLoading = true;
      this.error = null;

      this.appartementService.deleteAppartementForProprietaire(this.proprietaireId, appartementId)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.loadAppartements();
          },
          error: (err) => {
            console.error('Erreur lors de la suppression:', err);
            this.error = `Erreur lors de la suppression de l'appartement: ${err.message}`;
          }
        });
    }
  }
}
