import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {FooterComponent} from '@shared/components/footer/footer.component';
import {IncidentService} from '@core/services/incident.service';
import {AuthService} from '@core/services/auth.service';
import {Incident, IncidentWithStatus} from '@core/models/incident.model';
import {AppartementService} from '@core/services/appartement.service';
import {Appartement} from '@core/models/appartement.model';
import {SyndicService} from '@core/services/syndic.service';
import {catchError, finalize, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {ImmeubleService} from '@core/services/immeuble.service';

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
  appartements: Appartement[] = [];
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
    private appartementService: AppartementService,
    private syndicService: SyndicService,
    private fb: FormBuilder,
    private immeubleService: ImmeubleService
  ) {
    this.incidentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['MOYENNE', Validators.required],
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
    this.loadAppartements();
  }

  private loadAppartements(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.userId) {
      this.loading = true;
      this.appartementService.getAppartementsProprietaire(currentUser.userId).subscribe({
        next: (appartements) => {
          this.appartements = appartements;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des appartements:', error);
          this.error = 'Erreur lors du chargement des appartements';
          this.loading = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.incidentForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser?.userId) {
        this.error = 'Utilisateur non connecté';
        return;
      }

      const formValue = this.incidentForm.value;
      const selectedAppartement = this.appartements.find(app => app.id === Number(formValue.appartementId));
      
      if (!selectedAppartement) {
        this.error = 'Appartement non trouvé';
        return;
      }

      if (!selectedAppartement.immeubleId) {
        this.error = 'Immeuble non trouvé';
        return;
      }

      this.loading = true;

      // Récupérer les informations de l'immeuble avec son syndic
      this.immeubleService.getImmeubleById(selectedAppartement.immeubleId).subscribe({
        next: (immeuble) => {
          console.log('Immeuble récupéré:', immeuble);
          
          if (!immeuble.syndic?.id) {
            this.error = 'Aucun syndic associé à cet immeuble';
            this.loading = false;
            return;
          }

          const syndicId = Number(immeuble.syndic.id);
          console.log('ID du syndic (avant conversion):', immeuble.syndic.id);
          console.log('ID du syndic (après conversion):', syndicId);

          if (isNaN(syndicId)) {
            this.error = 'ID du syndic invalide';
            this.loading = false;
            return;
          }

          const now = new Date().toISOString();
          const incident = {
            title: formValue.title,
            description: formValue.description,
            priority: formValue.priority,
            status: 'NOUVEAU' as const,
            immeubleId: Number(selectedAppartement.immeubleId),
            appartementId: Number(formValue.appartementId),
            reportedDate: now,
            category: formValue.category,
            reportedBy: Number(currentUser.userId),
            assignedToId: syndicId,
            createdBy: currentUser.email,
            createdAt: now,
            updatedBy: currentUser.email,
            updatedAt: now
          };

          console.log('Incident à créer:', incident);

          this.incidentService.createIncident(incident)
            .pipe(
              catchError(error => {
                console.error('Erreur lors de la création de l\'incident:', error);
                this.error = 'Erreur lors de la création de l\'incident';
                return of(null);
              }),
              finalize(() => this.loading = false)
            )
            .subscribe({
              next: (newIncident) => {
                if (newIncident) {
                  console.log('Incident créé:', newIncident);
                  const incidentWithStatus = {
                    ...newIncident,
                    statut: newIncident.status,
                    priorite: newIncident.priority,
                    titre: newIncident.title,
                    date: newIncident.reportedDate
                  };
                  this.incidents.unshift(incidentWithStatus);
                  this.filterIncidents();
                  this.updateStatistics();
                  this.closeCreateModal();
                }
              }
            });
        },
        error: (error) => {
          console.error('Erreur lors de la récupération de l\'immeuble:', error);
          this.error = 'Erreur lors de la récupération de l\'immeuble';
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
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser?.userId) {
        this.error = 'Utilisateur non connecté';
        return;
      }

      // Vérification supplémentaire pour s'assurer que selectedIncident n'est pas null
      if (!this.selectedIncident?.immeubleId || !this.selectedIncident?.appartementId) {
        this.error = 'Données de l\'incident incomplètes';
        return;
      }

      const selectedAppartement = this.appartements.find(app => app.id === this.selectedIncident!.appartementId);
      if (!selectedAppartement) {
        this.error = 'Appartement non trouvé';
        return;
      }

      const formValue = this.editForm.value;
      this.loading = true;

      // À ce stade, selectedIncident est garanti non-null et a un id
      const incident = this.selectedIncident! as Required<Pick<IncidentWithStatus, 'id' | 'immeubleId' | 'appartementId' | 'status'>>;
      const updatedIncident: Partial<Incident> = {
        ...this.selectedIncident,  // Garder toutes les propriétés existantes
        title: formValue.title,
        description: formValue.description,
        priority: formValue.priority,
        category: formValue.category,
        reportedDate: this.selectedIncident.reportedDate,  // Garder la date originale
        reportedBy: this.selectedIncident.reportedBy,  // Garder le propriétaire original
        assignedTo: selectedAppartement.immeuble?.syndic?.id,
        immeubleId: incident.immeubleId,
        appartementId: incident.appartementId,
        updatedBy: currentUser.email,
        updatedAt: new Date().toISOString()
      };

      this.incidentService.updateIncident(incident.id, updatedIncident)
        .pipe(
          catchError(error => {
            console.error('Erreur lors de la mise à jour de l\'incident:', error);
            this.error = 'Erreur lors de la mise à jour de l\'incident';
            return of(null);
          }),
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (updated) => {
            if (updated) {
              const index = this.incidents.findIndex(i => i.id === this.selectedIncident?.id);
              if (index !== -1) {
                this.incidents[index] = {
                  ...updated,
                  statut: updated.status,
                  priorite: updated.priority,
                  titre: updated.title,
                  date: updated.reportedDate
                };
                this.filterIncidents();
              }
              this.closeEditModal();
            }
          }
        });
    }
  }
}
