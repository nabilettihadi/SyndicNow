import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { IncidentService } from '@core/services/incident.service';
import { AuthService } from '@core/services/auth.service';
import { Incident } from '@core/models/incident.model';

@Component({
  selector: 'app-mes-incidents',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './mes-incidents.component.html'
})
export class MesIncidentsComponent implements OnInit {
  incidents: Incident[] = [];
  filteredIncidents: Incident[] = [];
  selectedStatus: 'NOUVEAU' | 'EN_COURS' | 'RESOLU' | '' = '';
  selectedPriority: 'HAUTE' | 'MOYENNE' | 'BASSE' | '' = '';

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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadIncidents();
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
}