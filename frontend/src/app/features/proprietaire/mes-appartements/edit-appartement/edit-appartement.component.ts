import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppartementService } from '@core/services/appartement.service';
import { ImmeubleService } from '@core/services/immeuble.service';
import { AuthService } from '@core/services/auth.service';
import { Immeuble } from '@core/models/immeuble.model';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-appartement',
  templateUrl: './edit-appartement.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class EditAppartementComponent implements OnInit {
  appartementForm: FormGroup;
  immeubles: Immeuble[] = [];
  isLoading = false;
  error: string | null = null;
  appartementId: number;
  proprietaireId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private appartementService: AppartementService,
    private immeubleService: ImmeubleService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.appartementForm = this.fb.group({
      immeubleId: ['', Validators.required],
      numero: ['', Validators.required],
      etage: ['', Validators.required],
      surface: ['', [Validators.required, Validators.min(1)]],
      nombrePieces: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });

    this.appartementId = +this.route.snapshot.params['id'];
    
    // Récupérer l'ID du propriétaire connecté
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.userId) {
      this.proprietaireId = currentUser.userId;
    } else {
      this.error = "Utilisateur non authentifié";
    }
  }

  ngOnInit(): void {
    this.loadImmeubles();
    this.loadAppartement();
  }

  private loadImmeubles(): void {
    this.immeubleService.getAllImmeubles().subscribe({
      next: (immeubles: Immeuble[]) => {
        this.immeubles = immeubles;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des immeubles:', err);
        this.error = 'Erreur lors du chargement des immeubles';
      }
    });
  }

  private loadAppartement(): void {
    this.isLoading = true;
    this.error = null;

    this.appartementService.getAppartementById(this.appartementId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (appartement: any) => {
          this.appartementForm.patchValue({
            immeubleId: appartement.immeubleId,
            numero: appartement.numero,
            etage: appartement.etage,
            surface: appartement.surface,
            nombrePieces: appartement.nombrePieces,
            description: appartement.description
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erreur lors du chargement de l\'appartement:', err);
          this.error = 'Erreur lors du chargement de l\'appartement';
        }
      });
  }

  onSubmit(): void {
    if (this.appartementForm.valid && this.proprietaireId) {
      this.isLoading = true;
      this.error = null;

      const formData = {
        ...this.appartementForm.value,
        surface: Number(this.appartementForm.value.surface),
        nombrePieces: Number(this.appartementForm.value.nombrePieces),
        etage: Number(this.appartementForm.value.etage),
        immeubleId: Number(this.appartementForm.value.immeubleId),
        proprietaireIds: [this.proprietaireId] // Ajouter l'ID du propriétaire
      };

      this.appartementService.updateAppartement(this.appartementId, formData)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.router.navigate(['/proprietaire/appartements']);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Erreur lors de la modification:', err);
            this.error = `Erreur lors de la modification de l'appartement: ${err.message}`;
          }
        });
    } else if (!this.proprietaireId) {
      this.error = "Erreur d'identification du propriétaire";
    }
  }
} 