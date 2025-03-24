import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { IncidentService } from '@core/services/incident.service';
import { AuthService } from '@core/services/auth.service';
import { Incident, IncidentWithStatus } from '@core/models/incident.model';
import { ImmeubleService } from '@core/services/immeuble.service';
import { AppartementService } from '@core/services/appartement.service';
import { Immeuble } from '@core/models/immeuble.model';
import { Appartement } from '@core/models/appartement.model';

@Component({
  selector: 'app-mes-incidents',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './mes-incidents.component.html'
})
export class MesIncidentsComponent implements OnInit {
  incidents: IncidentWithStatus[] = [];
  filteredIncidents: IncidentWithStatus[] = [];
  selectedStatus: 'NOUVEAU' | 'EN_COURS' | 'RESOLU' | '' = '';
  selectedPriority: 'HAUTE' | 'MOYENNE' | 'BASSE' | '' = '';
  immeubles: Immeuble[] = [];
  appartements: Appartement[] = [];
  appartementsByImmeuble: { [key: number]: Appartement[] } = {};
  showCreateModal = false;
  showEditModal = false;
  incidentForm: FormGroup;
  editForm: FormGroup;
  selectedIncident: IncidentWithStatus | null = null;

  stats = {
    total: 0,
    nouveau: 0,
    enCours: 0,
    resolu: 0
  };

  loading = false;
  error: string | null = null;

  constructor(
    private incidentService: IncidentService,
    private authService: AuthService,
    private immeubleService: ImmeubleService,
    private appartementService: AppartementService,
    private fb: FormBuilder
  ) {
    this.incidentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['MOYENNE', Validators.required],
      immeubleId: ['', Validators.required],
      appartementId: ['', Validators.required],
      category: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['MOYENNE', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadIncidents();
    this.loadImmeubles();
  }

  private loadImmeubles(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.userId) {
      // D'abord, chargeons les appartements du propriétaire
      this.appartementService.getAppartementsByProprietaire(currentUser.userId).subscribe({
        next: (appartements: Appartement[]) => {
          this.appartements = appartements;
          
          // Extraire les immeubles uniques à partir des appartements
          const immeubleIds = new Set(appartements.map(app => app.immeubleId));
          this.immeubles = appartements
            .filter(app => app.immeuble)
            .filter((app, index, self) => 
              index === self.findIndex(a => a.immeubleId === app.immeubleId)
            )
            .map(app => ({
              id: app.immeubleId,
              nom: app.immeuble?.nom || 'Immeuble inconnu',
              adresse: app.immeuble?.adresse || '',
              codePostal: '',
              ville: app.immeuble?.ville || '',
              nombreEtages: 0,
              nombreAppartements: 0,
              status: 'ACTIF' as const,
              syndicId: 0
            }));
          
          // Organiser les appartements par immeuble
          this.appartementsByImmeuble = appartements.reduce((acc, app) => {
            if (!acc[app.immeubleId]) {
              acc[app.immeubleId] = [];
            }
            acc[app.immeubleId].push(app);
            return acc;
          }, {} as { [key: number]: Appartement[] });

          console.log('Immeubles chargés:', this.immeubles);
          console.log('Appartements par immeuble:', this.appartementsByImmeuble);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des appartements:', error);
          this.error = 'Erreur lors du chargement des appartements';
        }
      });
    }
  }

  onImmeubleChange(event: any): void {
    console.log('Changement d\'immeuble:', event.target.value);
    const immeubleId = parseInt(event.target.value, 10);
    this.incidentForm.patchValue({ appartementId: '' });
    
    if (immeubleId) {
      const appartements = this.appartementsByImmeuble[immeubleId] || [];
      console.log('Appartements disponibles:', appartements);
      if (appartements.length === 1) {
        // Si un seul appartement est disponible, le sélectionner automatiquement
        this.incidentForm.patchValue({ appartementId: appartements[0].id });
      }
    }
  }

  private loadIncidents(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser?.userId) {
      this.incidentService.getIncidentsByProprietaire(currentUser.userId).subscribe({
        next: (data) => {
          this.incidents = data;
          this.filterIncidents();
          this.updateStatistics();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des incidents';
          this.loading = false;
        }
      });
    }
  }

  filterIncidents() {
    this.filteredIncidents = this.incidents.filter(incident => {
      const statusMatch = !this.selectedStatus || incident.statut === this.selectedStatus;
      const priorityMatch = !this.selectedPriority || incident.priorite === this.selectedPriority;
      return statusMatch && priorityMatch;
    });
  }

  updateStatistics() {
    this.stats.total = this.incidents.length;
    this.stats.nouveau = this.incidents.filter(i => i.statut === 'NOUVEAU').length;
    this.stats.enCours = this.incidents.filter(i => i.statut === 'EN_COURS').length;
    this.stats.resolu = this.incidents.filter(i => i.statut === 'RESOLU').length;
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
        this.error = 'Utilisateur non connecté';
        return;
      }

      const formValue = this.incidentForm.value;
      const incident: Partial<Incident> = {
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority,
        status: 'NOUVEAU',
        immeubleId: formValue.immeubleId,
        appartementId: formValue.appartementId,
        reportedDate: new Date(),
        category: formValue.category
      };

      this.loading = true;
      this.incidentService.createIncident(incident as Incident).subscribe({
        next: (newIncident) => {
          this.incidents.unshift(newIncident);
          this.filterIncidents();
          this.updateStatistics();
          this.closeCreateModal();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.error = 'Erreur lors de la création de l\'incident';
          this.loading = false;
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

  updateIncident(incident: IncidentWithStatus): void {
    if (!incident.id) return;

    this.loading = true;
    this.incidentService.updateIncident(incident.id, incident).subscribe({
      next: (updatedIncident) => {
        const index = this.incidents.findIndex(i => i.id === incident.id);
        if (index !== -1) {
          this.incidents[index] = updatedIncident;
          this.filterIncidents();
          this.updateStatistics();
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors de la mise à jour de l\'incident';
        this.loading = false;
      }
    });
  }

  updateIncidentStatus(incident: IncidentWithStatus, newStatus: string): void {
    if (!incident.id) return;
    
    this.loading = true;
    this.incidentService.updateIncidentStatus(incident.id, newStatus).subscribe({
      next: (updatedIncident) => {
        const index = this.incidents.findIndex(i => i.id === incident.id);
        if (index !== -1) {
          this.incidents[index] = updatedIncident;
          this.filterIncidents();
          this.updateStatistics();
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors de la mise à jour du statut';
        this.loading = false;
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getStatusStyle(status: string): string {
    switch (status) {
      case 'NOUVEAU':
        return 'bg-yellow-100 text-yellow-800';
      case 'EN_COURS':
        return 'bg-blue-100 text-blue-800';
      case 'RESOLU':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityStyle(priority: string): string {
    switch (priority) {
      case 'HAUTE':
        return 'bg-red-100 text-red-800';
      case 'MOYENNE':
        return 'bg-yellow-100 text-yellow-800';
      case 'BASSE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'NOUVEAU':
        return 'Nouveau';
      case 'EN_COURS':
        return 'En cours';
      case 'RESOLU':
        return 'Résolu';
      default:
        return status;
    }
  }

  formatPriority(priority: string): string {
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

  openEditModal(incident: IncidentWithStatus) {
    this.selectedIncident = incident;
    this.editForm.patchValue({
      title: incident.title,
      description: incident.description,
      priority: incident.priority,
      category: incident.category
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
      const updatedIncident: Partial<Incident> = {
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority,
        category: formValue.category,
        immeubleId: this.selectedIncident.immeubleId
      };

      this.loading = true;
      this.incidentService.updateIncident(this.selectedIncident.id, updatedIncident as Incident).subscribe({
        next: (updated) => {
          const index = this.incidents.findIndex(i => i.id === this.selectedIncident?.id);
          if (index !== -1) {
            this.incidents[index] = updated;
            this.filterIncidents();
            this.updateStatistics();
          }
          this.closeEditModal();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur de mise à jour:', error);
          this.error = 'Erreur lors de la mise à jour de l\'incident';
          this.loading = false;
        }
      });
    }
  }
}