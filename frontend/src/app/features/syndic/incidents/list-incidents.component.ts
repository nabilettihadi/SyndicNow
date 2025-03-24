import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {FooterComponent} from '@shared/components/footer/footer.component';
import {IncidentService} from '@core/services/incident.service';
import {ImmeubleService} from '@core/services/immeuble.service';
import {AuthService} from '@core/services/auth.service';
import {IncidentWithStatus} from '@core/models/incident.model';
import {Immeuble} from '@core/models/immeuble.model';

@Component({
  selector: 'app-list-incidents',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './list-incidents.component.html',
  styleUrls: []
})
export class ListIncidentsComponent implements OnInit {
  isLoading = true;
  hasError = false;
  errorMessage = '';
  showCreateModal = false;
  incidentForm: FormGroup;

  incidents: IncidentWithStatus[] = [];
  filteredIncidents: IncidentWithStatus[] = [];
  immeubles: Immeuble[] = [];
  searchTerm: string = '';
  statusFilter: string = 'ALL';
  priorityFilter: string = 'ALL';
  immeubleFilter: number | 'ALL' = 'ALL';

  stats = {
    total: 0,
    nouveau: 0,
    enCours: 0,
    resolu: 0
  };

  constructor(
    private incidentService: IncidentService,
    private immeubleService: ImmeubleService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.incidentForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priorite: ['MOYENNE', Validators.required],
      immeubleId: ['', Validators.required],
      categorie: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadImmeubles();
  }

  loadImmeubles(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.userId) {
      this.hasError = true;
      this.errorMessage = 'Utilisateur non connecté';
      return;
    }

    this.immeubleService.getImmeublesBySyndic(currentUser.userId).subscribe({
      next: (immeubles) => {
        this.immeubles = immeubles;
        this.loadIncidents();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des immeubles:', error);
        this.hasError = true;
        this.errorMessage = 'Une erreur est survenue lors du chargement des immeubles';
      }
    });
  }

  loadIncidents(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.userId) {
      this.hasError = true;
      this.errorMessage = 'Utilisateur non connecté';
      return;
    }

    this.isLoading = true;
    this.incidentService.getIncidentsBySyndic(currentUser.userId).subscribe({
      next: (data) => {
        this.incidents = data;
        this.filteredIncidents = [...this.incidents];
        this.updateStatistics();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des incidents:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Une erreur est survenue lors du chargement des incidents';
      }
    });
  }

  updateStatistics(): void {
    this.stats = {
      total: this.incidents.length,
      nouveau: this.incidents.filter(i => i.status === 'NOUVEAU').length,
      enCours: this.incidents.filter(i => i.status === 'EN_COURS').length,
      resolu: this.incidents.filter(i => i.status === 'RESOLU').length
    };
  }

  applyFilter(): void {
    if (!this.searchTerm.trim() && this.statusFilter === 'ALL' && this.priorityFilter === 'ALL' && this.immeubleFilter === 'ALL') {
      this.filteredIncidents = [...this.incidents];
      return;
    }

    let filtered = [...this.incidents];

    // Filtre par statut
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(incident => incident.status === this.statusFilter);
    }

    // Filtre par priorité
    if (this.priorityFilter !== 'ALL') {
      filtered = filtered.filter(incident => incident.priorite === this.priorityFilter);
    }

    // Filtre par immeuble
    if (this.immeubleFilter !== 'ALL') {
      filtered = filtered.filter(incident => incident.immeubleId === this.immeubleFilter);
    }

    // Filtre par texte de recherche
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(incident =>
        incident.titre.toLowerCase().includes(searchLower) ||
        incident.description.toLowerCase().includes(searchLower) ||
        (incident.immeuble?.nom.toLowerCase() || '').includes(searchLower)
      );
    }

    this.filteredIncidents = filtered;
  }

  updateIncidentStatus(incident: IncidentWithStatus, newStatus: string): void {
    if (!incident.id) return;

    this.incidentService.updateIncidentStatus(incident.id, newStatus).subscribe({
      next: (updatedIncident) => {
        const index = this.incidents.findIndex(i => i.id === incident.id);
        if (index !== -1) {
          this.incidents[index] = updatedIncident;
          this.applyFilter();
          this.updateStatistics();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        this.errorMessage = 'Une erreur est survenue lors de la mise à jour du statut';
      }
    });
  }

  getStatusBadgeClass(statut: string): string {
    switch (statut) {
      case 'RESOLU':
        return 'bg-green-100 text-green-800';
      case 'EN_COURS':
        return 'bg-yellow-100 text-yellow-800';
      case 'NOUVEAU':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'RESOLU':
        return 'Résolu';
      case 'EN_COURS':
        return 'En cours';
      case 'NOUVEAU':
        return 'Nouveau';
      default:
        return status;
    }
  }

  getPriorityColorClass(priorite: string): string {
    switch (priorite) {
      case 'HAUTE':
        return 'text-red-500';
      case 'MOYENNE':
        return 'text-orange-500';
      case 'BASSE':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  }

  getPriorityLabel(priorite: string): string {
    switch (priorite) {
      case 'HAUTE':
        return 'Haute';
      case 'MOYENNE':
        return 'Moyenne';
      case 'BASSE':
        return 'Basse';
      default:
        return priorite;
    }
  }

  deleteIncident(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet incident ?')) {
      this.incidentService.deleteIncident(id).subscribe({
        next: () => {
          this.incidents = this.incidents.filter(i => i.id !== id);
          this.applyFilter();
          this.updateStatistics();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'incident:', error);
          this.errorMessage = 'Une erreur est survenue lors de la suppression de l\'incident';
        }
      });
    }
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.incidentForm.reset({
      priorite: 'MOYENNE'
    });
  }

  onSubmit() {
    if (this.incidentForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser?.userId) {
        this.errorMessage = 'Utilisateur non connecté';
        return;
      }

      const formValue = this.incidentForm.value;
      const incident: Partial<IncidentWithStatus> = {
        titre: formValue.titre,
        description: formValue.description,
        priorite: formValue.priorite,
        statut: 'NOUVEAU',
        immeubleId: formValue.immeubleId,
        date: new Date(),
        categorie: formValue.categorie
      };

      this.isLoading = true;
      this.incidentService.createIncident(incident as IncidentWithStatus).subscribe({
        next: (newIncident) => {
          this.incidents.unshift(newIncident);
          this.applyFilter();
          this.updateStatistics();
          this.closeCreateModal();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la création de l\'incident';
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.incidentForm.controls).forEach(key => {
        const control = this.incidentForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
