import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppartementService } from '@core/services/appartement.service';
import { AppartementDetails } from '@core/models/appartement.model';
import { ImmeubleService } from '@core/services/immeuble.service';
import { ProprietaireService } from '@core/services/proprietaire.service';
import { Immeuble } from '@core/models/immeuble.model';
import { Proprietaire } from '@core/models/proprietaire.model';

@Component({
  selector: 'app-appartement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appartement-form.component.html',
  styleUrls: ['./appartement-form.component.css']
})
export class AppartementFormComponent implements OnInit {
  appartementForm: FormGroup;
  immeubles: Immeuble[] = [];
  proprietaires: Proprietaire[] = [];
  isEditMode = false;
  appartementId: number | undefined;
  loading = false;
  error: string | null = null;
  etages: number[] = [];

  constructor(
    private fb: FormBuilder,
    private appartementService: AppartementService,
    private immeubleService: ImmeubleService,
    private proprietaireService: ProprietaireService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.appartementForm = this.fb.group({
      numero: ['', Validators.required],
      etage: [0, Validators.required],
      surface: [0, Validators.required],
      nombrePieces: [0, Validators.required],
      loyer: [0, Validators.required],
      charges: [0, Validators.required],
      status: ['LIBRE', Validators.required],
      immeubleId: [null, Validators.required],
      proprietaireId: [null],
      caracteristiques: this.fb.group({
        nbChambres: [0],
        nbSallesDeBain: [0],
        balcon: [false],
        parking: [false],
        meuble: [false]
      }),
      description: ['']
    });
    
    // Initialiser les étages de -2 à 20
    this.etages = Array.from({ length: 23 }, (_, i) => i - 2);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.appartementId = +params['id'];
        this.loadAppartement();
      }
    });

    this.loadImmeubles();
    this.loadProprietaires();
  }

  private loadAppartement(): void {
    if (!this.appartementId) return;
    
    this.loading = true;
    this.appartementService.getAppartementDetails(this.appartementId).subscribe({
      next: (appartement: AppartementDetails) => {
        this.appartementForm.patchValue({
          numero: appartement.numero,
          etage: appartement.etage,
          surface: appartement.surface,
          nombrePieces: appartement.nombrePieces,
          loyer: appartement.loyer,
          charges: appartement.charges,
          status: appartement.status,
          immeubleId: appartement.immeubleId,
          proprietaireId: appartement.proprietaireId,
          caracteristiques: {
            nbChambres: appartement.caracteristiques?.nbChambres || 0,
            nbSallesDeBain: appartement.caracteristiques?.nbSallesDeBain || 0,
            balcon: appartement.caracteristiques?.balcon || false,
            parking: appartement.caracteristiques?.parking || false,
            meuble: appartement.caracteristiques?.meuble || false
          },
          description: appartement.description || ''
        });
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Erreur lors du chargement de l\'appartement:', error);
        this.error = 'Impossible de charger l\'appartement. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.appartementForm.valid) {
      const appartementData = this.appartementForm.value;
      
      if (this.isEditMode && this.appartementId) {
        this.appartementService.updateAppartement(this.appartementId, appartementData).subscribe({
          next: () => this.router.navigate(['/appartements']),
          error: (error: Error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.error = 'Impossible de mettre à jour l\'appartement. Veuillez réessayer plus tard.';
          }
        });
      } else {
        this.appartementService.createAppartement(appartementData).subscribe({
          next: () => this.router.navigate(['/appartements']),
          error: (error: Error) => {
            console.error('Erreur lors de la création:', error);
            this.error = 'Impossible de créer l\'appartement. Veuillez réessayer plus tard.';
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/appartements']);
  }

  get caracteristiques() {
    return this.appartementForm.get('caracteristiques') as FormGroup;
  }

  private loadImmeubles(): void {
    this.immeubleService.getAllImmeubles().subscribe((immeubles: Immeuble[]) => {
      this.immeubles = immeubles;
    });
  }

  private loadProprietaires(): void {
    this.proprietaireService.getAllProprietaires().subscribe((proprietaires: Proprietaire[]) => {
      this.proprietaires = proprietaires;
    });
  }
} 