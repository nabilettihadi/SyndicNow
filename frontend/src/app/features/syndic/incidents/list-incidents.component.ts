import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {FooterComponent} from '@shared/components/footer/footer.component';
import {IncidentService} from '@core/services/incident.service';
import {ImmeubleService} from '@core/services/immeuble.service';
import {AuthService} from '@core/services/auth.service';
import {Incident, IncidentStatus, IncidentWithStatus} from '@core/models/incident.model';
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
  showEditModal = false;
  incidentForm: FormGroup;
  editForm: FormGroup;
  selectedIncident: IncidentWithStatus | null = null;

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
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['MOYENNE', Validators.required],
      immeubleId: ['', Validators.required],
      category: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['MOYENNE', Validators.required],
      category: ['', Validators.required],
      status: ['', Validators.required]
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
      filtered = filtered.filter(incident => incident.priority === this.priorityFilter);
    }

    // Filtre par immeuble
    if (this.immeubleFilter !== 'ALL') {
      filtered = filtered.filter(incident => incident.immeubleId === this.immeubleFilter);
    }

    // Filtre par texte de recherche
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(incident =>
        incident.title.toLowerCase().includes(searchLower) ||
        incident.description.toLowerCase().includes(searchLower) ||
        (incident.immeuble?.nom.toLowerCase() || '').includes(searchLower)
      );
    }

    this.filteredIncidents = filtered;
  }

  updateIncidentStatus(incident: IncidentWithStatus, newStatus: IncidentStatus): void {
    if (!incident.id) return;

    // Vérifier la progression valide des statuts
    if ((incident.status === 'NOUVEAU' && newStatus !== 'EN_COURS') ||
        (incident.status === 'EN_COURS' && newStatus !== 'RESOLU') ||
        (incident.status === 'RESOLU')) {
      this.errorMessage = 'Progression de statut invalide';
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.userId) {
      this.errorMessage = 'Utilisateur non connecté';
      return;
    }

    console.log(`Tentative de mise à jour du statut de l'incident ${incident.id} de ${incident.status} à ${newStatus}`);

    const updatedIncident: Partial<IncidentWithStatus> = {
      ...incident,
      status: newStatus,
      statut: newStatus,
      updatedBy: currentUser.email,
      updatedAt: new Date().toISOString()
    };

    this.incidentService.updateIncidentStatus(incident.id, newStatus).subscribe({
      next: (updated) => {
        console.log(`Statut mis à jour avec succès:`, updated);
        const index = this.incidents.findIndex(i => i.id === incident.id);
        if (index !== -1) {
          this.incidents[index] = {
            ...this.incidents[index],
            ...updated,
            statut: updated.status
          };
          this.applyFilter();
          this.updateStatistics();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        this.errorMessage = `Erreur lors de la mise à jour du statut: ${error.error?.message || 'Erreur inconnue'}`;
      }
    });
  }

  getStatusBadgeClass(status: IncidentStatus): string {
    switch (status) {
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

  getStatusLabel(status: IncidentStatus): string {
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

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'HAUTE':
        return 'Haute';
      case 'MOYENNE':
        return 'Moyenne';
      case 'BASSE':
        return 'Basse';
      default:
        return priority;
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
      priority: 'MOYENNE'
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
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority,
        status: 'NOUVEAU',
        immeubleId: formValue.immeubleId,
        date: new Date().toISOString().split('T')[0],
        category: formValue.category,
        statut: 'NOUVEAU',
        priorite: formValue.priority,
        titre: formValue.title
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

  openEditModal(incident: IncidentWithStatus) {
    this.selectedIncident = incident;
    this.editForm.patchValue({
      title: incident.title,
      description: incident.description,
      priority: incident.priority,
      category: incident.category,
      status: incident.status
    });
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedIncident = null;
    this.editForm.reset();
  }

  submitEdit() {
    if (this.editForm.valid && this.selectedIncident?.id) {
      const formValue = this.editForm.value;
      const updatedIncident: Partial<IncidentWithStatus> = {
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority,
        category: formValue.category,
        status: formValue.status,
        date: new Date().toISOString().split('T')[0],
        statut: formValue.status,
        priorite: formValue.priority,
        titre: formValue.title
      };

      this.isLoading = true;
      this.incidentService.updateIncident(this.selectedIncident.id, updatedIncident as IncidentWithStatus).subscribe({
        next: (updated) => {
          const index = this.incidents.findIndex(i => i.id === this.selectedIncident?.id);
          if (index !== -1) {
            this.incidents[index] = {
              ...updated,
              statut: updated.status,
              priorite: updated.priority,
              titre: updated.title,
              date: updated.reportedDate
            };
            this.applyFilter();
          }
          this.closeEditModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.errorMessage = 'Erreur lors de la mise à jour de l\'incident';
          this.isLoading = false;
        }
      });
    }
  }
}
