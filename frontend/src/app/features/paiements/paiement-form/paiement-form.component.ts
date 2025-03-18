import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PaiementService } from '../../../core/services/paiement.service';
import { LocataireService } from '../../../core/services/locataire.service';
import { Paiement } from '../../../core/models/paiement.model';
import { Locataire } from '../../../core/models/locataire.model';

@Component({
  selector: 'app-paiement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paiement-form.component.html',
  styleUrls: ['./paiement-form.component.css']
})
export class PaiementFormComponent implements OnInit {
  paiementForm: FormGroup;
  isEditMode = false;
  paiementId?: number;
  locataires: Locataire[] = [];

  constructor(
    private fb: FormBuilder,
    private paiementService: PaiementService,
    private locataireService: LocataireService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.paiementForm = this.fb.group({
      locataireId: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      datePaiement: ['', Validators.required],
      methodePaiement: ['VIREMENT', Validators.required],
      statut: ['EN_ATTENTE', Validators.required],
      description: [''],
      reference: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLocataires();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.paiementId = +params['id'];
        this.loadPaiement();
      } else {
        // Générer une référence unique pour un nouveau paiement
        this.generateReference();
      }
    });
  }

  loadLocataires(): void {
    this.locataireService.getAllLocataires().subscribe({
      next: (locataires) => {
        this.locataires = locataires.filter(l => !l.dateFin || new Date(l.dateFin) > new Date());
      },
      error: (error) => {
        console.error('Erreur lors du chargement des locataires:', error);
      }
    });
  }

  loadPaiement(): void {
    if (this.paiementId) {
      this.paiementService.getPaiementById(this.paiementId).subscribe({
        next: (paiement) => {
          this.paiementForm.patchValue({
            locataireId: paiement.locataire.id,
            montant: paiement.montant,
            datePaiement: this.formatDateForInput(paiement.datePaiement),
            methodePaiement: paiement.methodePaiement,
            statut: paiement.statut,
            description: paiement.description,
            reference: paiement.reference
          });
        },
        error: (error) => {
          console.error('Erreur lors du chargement du paiement:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.paiementForm.valid) {
      const paiementData = this.paiementForm.value;
      
      if (this.isEditMode && this.paiementId) {
        this.paiementService.updatePaiement(this.paiementId, paiementData).subscribe({
          next: () => {
            this.router.navigate(['/paiements']);
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du paiement:', error);
          }
        });
      } else {
        this.paiementService.createPaiement(paiementData).subscribe({
          next: () => {
            this.router.navigate(['/paiements']);
          },
          error: (error) => {
            console.error('Erreur lors de la création du paiement:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/paiements']);
  }

  private formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  private generateReference(): void {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const reference = `PAY-${year}${month}-${random}`;
    this.paiementForm.patchValue({ reference });
  }
} 