import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { IncidentService } from '@core/services/incident.service';
import { IncidentWithStatus } from '@core/models/incident.model';

@Component({
  selector: 'app-list-incidents',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './list-incidents.component.html',
  styleUrls: []
})
export class ListIncidentsComponent implements OnInit {
  syndicId: number = 1; // À remplacer par l'ID du syndic actuel
  isLoading = true;
  hasError = false;
  errorMessage = '';
  
  incidents: IncidentWithStatus[] = [];
  filteredIncidents: IncidentWithStatus[] = [];
  searchTerm: string = '';
  statusFilter: string = 'ALL';
  priorityFilter: string = 'ALL';

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.incidentService.getIncidentsBySyndic(this.syndicId).subscribe({
      next: (data) => {
        this.incidents = data;
        this.filteredIncidents = [...this.incidents];
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

  applyFilter(): void {
    if (!this.searchTerm.trim() && this.statusFilter === 'ALL' && this.priorityFilter === 'ALL') {
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
    
    // Filtre par texte de recherche
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(incident => 
        incident.titre.toLowerCase().includes(searchLower) || 
        incident.description.toLowerCase().includes(searchLower) ||
        incident.rapporteur.toLowerCase().includes(searchLower) ||
        (incident.immeuble?.nom.toLowerCase() || '').includes(searchLower)
      );
    }
    
    this.filteredIncidents = filtered;
  }

  getTotalByStatus(status: string): number {
    return this.incidents.filter(incident => incident.status === status).length;
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
          this.filteredIncidents = this.filteredIncidents.filter(i => i.id !== id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'incident:', error);
          alert('Une erreur est survenue lors de la suppression de l\'incident');
        }
      });
    }
  }
} 