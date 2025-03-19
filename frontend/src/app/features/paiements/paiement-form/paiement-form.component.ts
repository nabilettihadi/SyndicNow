import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaiementService } from '@core/services/paiement.service';
import { LocataireService } from '@core/services/locataire.service';
import { Paiement } from '@core/models/paiement.model';
import { Locataire } from '@core/models/locataire.model';

@Component({
  selector: 'app-paiement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paiement-form.component.html',
  styleUrls: ['./paiement-form.component.css']
})
export class PaiementFormComponent implements OnInit {
  paiementForm: FormGroup;
  locataires: Locataire[] = [];
  loading = false;
  error: string | null = null;
  isEditMode = false;
  paiementId: number = 0;

  constructor(
    private fb: FormBuilder,
    private paiementService: PaiementService,
    private locataireService: LocataireService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paiementForm = this.fb.group({
      montant: ['', [Validators.required, Validators.min(0)]],
      datePaiement: ['', Validators.required],
      type: ['', Validators.required],
      locataireId: [null, Validators.required],
      status: ['EN_ATTENTE', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.paiementId = +params['id'];
        this.loadPaiement();
      }
    });

    this.loadLocataires();
  }

  private loadLocataires(): void {
    this.locataireService.getAllLocataires().subscribe((locataires: Locataire[]) => {
      this.locataires = locataires.filter((l: Locataire) => l.status === 'ACTIF');
    });
  }

  private loadPaiement(): void {
    this.loading = true;
    this.paiementService.getPaiementById(this.paiementId).subscribe({
      next: (paiement: Paiement) => {
        this.paiementForm.patchValue({
          montant: paiement.montant,
          datePaiement: this.formatDateForInput(new Date(paiement.datePaiement)),
          type: paiement.type,
          locataireId: paiement.locataire?.id,
          status: paiement.status
        });
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Erreur lors du chargement du paiement';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.paiementForm.valid) {
      this.loading = true;
      const paiementData = this.paiementForm.value;

      const operation = this.isEditMode
        ? this.paiementService.updatePaiement(this.paiementId, paiementData)
        : this.paiementService.createPaiement(paiementData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/paiements']);
        },
        error: (error: Error) => {
          this.error = 'Erreur lors de la sauvegarde du paiement';
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
    this.router.navigate(['/paiements']);
  }
} 