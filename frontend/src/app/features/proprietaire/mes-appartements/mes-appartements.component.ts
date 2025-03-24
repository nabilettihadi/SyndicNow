import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {FooterComponent} from '@shared/components/footer/footer.component';
import {AppartementService} from '@core/services/appartement.service';
import {ImmeubleService} from '@core/services/immeuble.service';
import {AuthService} from '@core/services/auth.service';
import {finalize} from 'rxjs';
import {AppartementDetails} from '@core/models/appartement.model';
import {Immeuble} from '@core/models/immeuble.model';

interface AppartementUI extends Omit<AppartementDetails, 'createdAt' | 'updatedAt'> {
  immeubleName?: string;
  proprietaireName?: string;
  createdAt?: string;
  updatedAt?: string;
  superficie?: number;
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
  immeubles: Immeuble[] = [];
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
    private immeubleService: ImmeubleService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.appartementForm = this.fb.group({
      numero: ['', [Validators.required, Validators.maxLength(10)]],
      etage: [0, [Validators.required, Validators.min(-5), Validators.max(100)]],
      superficie: [0, [Validators.required, Validators.min(1), Validators.max(1000)]],
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

    this.loading = true;
    this.error = null;
    
    this.appartementService.getAppartementsProprietaire(currentUser.userId).subscribe({
      next: (data: AppartementDetails[]) => {
        // Mapper les données pour ajouter les propriétés UI
        this.appartements = data.map(app => {
          const appUI: AppartementUI = {
            ...app,
            immeubleName: app.immeuble?.nom || 'Non défini',
            proprietaireName: app.proprietaire ? `${app.proprietaire.nom} ${app.proprietaire.prenom}` : 'Non défini',
            createdAt: (app.createdAt || app.dateCreation || new Date()).toString(),
            updatedAt: (app.updatedAt || new Date()).toString(),
            superficie: app.surface
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

  private loadImmeubles(): void {
    this.loading = true;
    this.error = null;
    
    this.immeubleService.getAllImmeubles().subscribe({
      next: (data) => {
        this.immeubles = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = `Erreur lors du chargement des immeubles: ${err.message}`;
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
      superficie: appartement.superficie || appartement.surface,
      description: appartement.description || '',
      immeubleId: appartement.immeubleId
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
      superficie: 0,
      description: '',
      immeubleId: null
    });
  }
  
  saveAppartement(): void {
    if (this.appartementForm.invalid) {
      this.appartementForm.markAllAsTouched();
      return;
    }
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.userId) {
      this.error = "Erreur d'identification de l'utilisateur";
      return;
    }
    
    const appartementData = {
      ...this.appartementForm.value
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
      this.appartementService.createAppartementForProprietaire(currentUser.userId, appartementData)
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
