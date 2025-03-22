import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {FooterComponent} from '@shared/components/footer/footer.component';
import {AppartementService} from '@core/services/appartement.service';
import {AuthService} from '@core/services/auth.service';
import {finalize} from 'rxjs';
import {AppartementDetails} from '@core/models/appartement.model';

// Interface pour étendre le modèle AppartementDetails du backend avec des propriétés supplémentaires pour l'UI
interface AppartementUI extends AppartementDetails {
  immeubleName?: string;
  proprietaireName?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-mes-appartements',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mes-appartements.component.html'
})
export class MesAppartementsComponent implements OnInit {
  appartements: AppartementUI[] = [];
  filteredAppartements: AppartementUI[] = [];
  loading = false;
  error: string | null = null;
  searchTerm: string = '';
  showAddForm = false;
  editingAppartementId: number | null = null;
  selectedAppartement: AppartementUI | null = null;
  showDeleteConfirmation = false;
  appartementForm: FormGroup;

  // Statistiques calculées
  get totalAppartements(): number {
    return this.filteredAppartements.length;
  }

  get appartementsOccupes(): number {
    return this.filteredAppartements.filter(a => a.status === 'OCCUPE').length;
  }

  get appartementsLibres(): number {
    return this.filteredAppartements.filter(a => a.status === 'LIBRE').length;
  }

  constructor(
    private appartementService: AppartementService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.appartementForm = this.fb.group({
      numero: ['', [Validators.required, Validators.maxLength(10)]],
      etage: [0, [Validators.required, Validators.min(-5), Validators.max(100)]],
      surface: [0, [Validators.required, Validators.min(1), Validators.max(1000)]],
      nombrePieces: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
      loyer: [0, [Validators.min(0)]],
      charges: [0, [Validators.min(0)]],
      description: [''],
      immeubleId: [null, Validators.required],
      status: ['LIBRE', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAppartements();
  }

  private loadAppartements(): void {
    const userId = this.authService.currentUserValue?.userId;
    if (!userId) return;

    this.loading = true;
    this.error = null;
    
    this.appartementService.getAppartementsProprietaire(userId).subscribe({
      next: (data: AppartementDetails[]) => {
        // Mapper les données pour ajouter les propriétés UI
        this.appartements = data.map(app => {
          const appUI: AppartementUI = {
            ...app,
            immeubleName: app.immeuble?.nom || 'Non défini',
            proprietaireName: app.proprietaire ? `${app.proprietaire.nom} ${app.proprietaire.prenom}` : 'Non défini',
            createdAt: app.dateCreation.toString(),
            updatedAt: new Date().toString()
          };
          return appUI;
        });
        this.filteredAppartements = [...this.appartements];
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = `Erreur lors du chargement des appartements: ${err.message}`;
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAppartements = [...this.appartements];
      return;
    }
    
    const searchLower = this.searchTerm.toLowerCase();
    this.filteredAppartements = this.appartements.filter(appartement => 
      appartement.numero.toLowerCase().includes(searchLower) || 
      appartement.immeubleName?.toLowerCase().includes(searchLower) || 
      appartement.description?.toLowerCase().includes(searchLower) ||
      this.getEtageLabel(appartement.etage).toLowerCase().includes(searchLower)
    );
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'OCCUPE':
        return 'bg-green-100 text-green-800';
      case 'LIBRE':
        return 'bg-blue-100 text-blue-800';
      case 'EN_TRAVAUX':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getEtageLabel(etage: number): string {
    if (etage === -1) return 'Sous-sol';
    if (etage === 0) return 'RDC';
    return `Étage ${etage}`;
  }
  
  // Fonctions pour gérer le formulaire
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.editingAppartementId = null;
    this.resetForm();
  }
  
  editAppartement(appartement: AppartementUI): void {
    this.editingAppartementId = appartement.id;
    this.showAddForm = true;
    
    this.appartementForm.patchValue({
      numero: appartement.numero,
      etage: appartement.etage,
      surface: appartement.surface,
      nombrePieces: appartement.nombrePieces,
      loyer: appartement.loyer,
      charges: appartement.charges,
      description: appartement.description || '',
      immeubleId: appartement.immeubleId,
      status: appartement.status
    });
  }
  
  cancelEdit(): void {
    this.showAddForm = false;
    this.editingAppartementId = null;
    this.resetForm();
  }
  
  resetForm(): void {
    this.appartementForm.reset({
      numero: '',
      etage: 0,
      surface: 0,
      nombrePieces: 1,
      loyer: 0,
      charges: 0,
      description: '',
      immeubleId: null,
      status: 'LIBRE'
    });
  }
  
  saveAppartement(): void {
    if (this.appartementForm.invalid) {
      this.appartementForm.markAllAsTouched();
      return;
    }
    
    const userId = this.authService.currentUserValue?.userId;
    if (!userId) {
      this.error = "Erreur d'identification de l'utilisateur";
      return;
    }
    
    const appartementData = {
      ...this.appartementForm.value,
      proprietaireId: userId
    };
    
    this.loading = true;
    this.error = null;
    
    if (this.editingAppartementId) {
      // Mise à jour d'un appartement existant
      this.appartementService.updateAppartement(this.editingAppartementId, appartementData)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.loadAppartements();
            this.cancelEdit();
          },
          error: (err: Error) => {
            this.error = `Erreur lors de la mise à jour de l'appartement: ${err.message}`;
          }
        });
    } else {
      // Ajout d'un nouvel appartement
      this.appartementService.createAppartement(appartementData)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.loadAppartements();
            this.cancelEdit();
          },
          error: (err: Error) => {
            this.error = `Erreur lors de l'ajout de l'appartement: ${err.message}`;
          }
        });
    }
  }
  
  // Fonctions pour gérer la suppression
  confirmDelete(appartement: AppartementUI): void {
    this.selectedAppartement = appartement;
    this.showDeleteConfirmation = true;
  }
  
  cancelDelete(): void {
    this.selectedAppartement = null;
    this.showDeleteConfirmation = false;
  }
  
  deleteAppartement(): void {
    if (!this.selectedAppartement) return;
    
    this.loading = true;
    this.error = null;
    
    this.appartementService.deleteAppartement(this.selectedAppartement.id)
      .pipe(finalize(() => {
        this.loading = false;
        this.showDeleteConfirmation = false;
      }))
      .subscribe({
        next: () => {
          this.loadAppartements();
          this.selectedAppartement = null;
        },
        error: (err: Error) => {
          this.error = `Erreur lors de la suppression de l'appartement: ${err.message}`;
        }
      });
  }
}
