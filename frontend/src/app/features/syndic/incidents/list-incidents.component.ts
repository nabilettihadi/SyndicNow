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

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'RESOLU':
        return 'syndic-badge syndic-badge-success';
      case 'EN_COURS':
        return 'syndic-badge syndic-badge-warning';
      case 'NOUVEAU':
        return 'syndic-badge syndic-badge-error';
      default:
        return 'syndic-badge';
    }
  }

  getPriorityClass(priorite: string): string {
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
} 