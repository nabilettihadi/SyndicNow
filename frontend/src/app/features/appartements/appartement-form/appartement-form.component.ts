import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppartementService } from '../../../core/services/appartement.service';
import { Appartement } from '../../../core/models/appartement.model';

@Component({
  selector: 'app-appartement-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './appartement-form.component.html',
  styleUrls: ['./appartement-form.component.css']
})
export class AppartementFormComponent implements OnInit {
  appartementForm: FormGroup;
  isEditMode = false;
  appartementId?: number;
  etages = Array.from({ length: 7 }, (_, i) => i - 1); // -1 à 5

  constructor(
    private fb: FormBuilder,
    private appartementService: AppartementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.appartementForm = this.fb.group({
      numero: ['', [Validators.required, Validators.minLength(1)]],
      etage: [0, [Validators.required, Validators.min(-1), Validators.max(5)]],
      surface: ['', [Validators.required, Validators.min(1)]],
      loyer: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      statut: ['LIBRE', Validators.required],
      caracteristiques: this.fb.group({
        nbChambres: [1, [Validators.required, Validators.min(0)]],
        nbSallesDeBain: [1, [Validators.required, Validators.min(0)]],
        balcon: [false],
        parking: [false],
        meuble: [false]
      })
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.appartementId = +params['id'];
        this.loadAppartement();
      }
    });
  }

  loadAppartement(): void {
    if (this.appartementId) {
      this.appartementService.getAppartementById(this.appartementId).subscribe({
        next: (appartement) => {
          this.appartementForm.patchValue({
            numero: appartement.numero,
            etage: appartement.etage,
            surface: appartement.surface,
            loyer: appartement.loyer,
            description: appartement.description,
            statut: appartement.statut,
            caracteristiques: {
              nbChambres: appartement.caracteristiques.nbChambres,
              nbSallesDeBain: appartement.caracteristiques.nbSallesDeBain,
              balcon: appartement.caracteristiques.balcon,
              parking: appartement.caracteristiques.parking,
              meuble: appartement.caracteristiques.meuble
            }
          });
        },
        error: (error) => {
          console.error('Erreur lors du chargement de l\'appartement:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.appartementForm.valid) {
      const appartementData = this.appartementForm.value;
      
      if (this.isEditMode && this.appartementId) {
        this.appartementService.updateAppartement(this.appartementId, appartementData).subscribe({
          next: () => {
            this.router.navigate(['/appartements']);
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour de l\'appartement:', error);
          }
        });
      } else {
        this.appartementService.createAppartement(appartementData).subscribe({
          next: () => {
            this.router.navigate(['/appartements']);
          },
          error: (error) => {
            console.error('Erreur lors de la création de l\'appartement:', error);
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
} 