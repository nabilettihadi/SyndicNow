import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocataireService } from '../../../core/services/locataire.service';
import { AppartementService } from '../../../core/services/appartement.service';
import { Locataire } from '../../../core/models/locataire.model';
import { Appartement } from '../../../core/models/appartement.model';

@Component({
  selector: 'app-locataire-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './locataire-form.component.html',
  styleUrls: ['./locataire-form.component.css']
})
export class LocataireFormComponent implements OnInit {
  locataireForm: FormGroup;
  isEditMode = false;
  locataireId?: number;
  appartements: Appartement[] = [];

  constructor(
    private fb: FormBuilder,
    private locataireService: LocataireService,
    private appartementService: AppartementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.locataireForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{9,}$/)]],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      appartementId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAppartements();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.locataireId = +params['id'];
        this.loadLocataire();
      }
    });
  }

  loadAppartements(): void {
    this.appartementService.getAllAppartements().subscribe({
      next: (appartements) => {
        this.appartements = appartements.filter(app => app.statut === 'LIBRE' || 
          (this.isEditMode && app.locataireActuel?.id === this.locataireId));
      },
      error: (error) => {
        console.error('Erreur lors du chargement des appartements:', error);
      }
    });
  }

  loadLocataire(): void {
    if (this.locataireId) {
      this.locataireService.getLocataireById(this.locataireId).subscribe({
        next: (locataire: Locataire) => {
          this.locataireForm.patchValue({
            nom: locataire.nom,
            prenom: locataire.prenom,
            email: locataire.email,
            telephone: locataire.telephone,
            dateDebut: this.formatDateForInput(locataire.dateDebut),
            dateFin: locataire.dateFin ? this.formatDateForInput(locataire.dateFin) : '',
            appartementId: locataire.appartement?.id
          });
        },
        error: (error) => {
          console.error('Erreur lors du chargement du locataire:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.locataireForm.valid) {
      const locataireData = this.locataireForm.value;
      
      if (this.isEditMode && this.locataireId) {
        this.locataireService.updateLocataire(this.locataireId, locataireData).subscribe({
          next: () => {
            this.router.navigate(['/locataires']);
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du locataire:', error);
          }
        });
      } else {
        this.locataireService.createLocataire(locataireData).subscribe({
          next: () => {
            this.router.navigate(['/locataires']);
          },
          error: (error) => {
            console.error('Erreur lors de la création du locataire:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/locataires']);
  }

  private formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
} 