import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppartementService } from '@core/services/appartement.service';
import { LocataireService } from '@core/services/locataire.service';
import { Appartement } from '@core/models/appartement.model';
import { Locataire } from '@core/models/locataire.model';

@Component({
  selector: 'app-locataire-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './locataire-form.component.html',
  styleUrls: ['./locataire-form.component.css']
})
export class LocataireFormComponent implements OnInit {
  locataireForm: FormGroup;
  appartements: Appartement[] = [];
  loading = false;
  error: string | null = null;
  isEditMode = false;
  locataireId: number = 0;

  constructor(
    private fb: FormBuilder,
    private locataireService: LocataireService,
    private appartementService: AppartementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.locataireForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      dateEntree: ['', Validators.required],
      dateSortie: [''],
      status: ['ACTIF', Validators.required],
      appartementId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.locataireId = +params['id'];
        this.loadLocataire();
      }
    });

    this.loadAppartements();
  }

  private loadAppartements(): void {
    this.appartementService.getAllAppartements().subscribe((appartements: Appartement[]) => {
      this.appartements = appartements.filter((app: Appartement) => 
        app.status === 'LIBRE' || 
        (this.isEditMode && app.id === this.locataireId)
      );
    });
  }

  private loadLocataire(): void {
    this.loading = true;
    this.locataireService.getLocataireById(this.locataireId).subscribe({
      next: (locataire: Locataire) => {
        this.locataireForm.patchValue({
          nom: locataire.nom,
          prenom: locataire.prenom,
          email: locataire.email,
          telephone: locataire.telephone,
          dateNaissance: this.formatDateForInput(locataire.dateNaissance),
          dateEntree: this.formatDateForInput(locataire.dateEntree),
          dateSortie: locataire.dateSortie ? this.formatDateForInput(locataire.dateSortie) : '',
          status: locataire.status,
          appartementId: locataire.appartementId
        });
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Erreur lors du chargement du locataire';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.locataireForm.valid) {
      this.loading = true;
      const locataireData = this.locataireForm.value;

      const operation = this.isEditMode
        ? this.locataireService.updateLocataire(this.locataireId, locataireData)
        : this.locataireService.createLocataire(locataireData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/locataires']);
        },
        error: (error: Error) => {
          this.error = 'Erreur lors de la sauvegarde du locataire';
          this.loading = false;
        }
      });
    }
  }

  formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onCancel(): void {
    this.router.navigate(['/locataires']);
  }
} 