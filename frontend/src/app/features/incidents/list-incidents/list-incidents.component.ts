import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IncidentService } from '../../../core/services/incident.service';
import { ImmeubleService } from '../../../core/services/immeuble.service';
import { Incident } from '../../../core/models/incident.model';
import { Immeuble } from '../../../core/models/immeuble.model';

@Component({
  selector: 'app-list-incidents',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-incidents.component.html',
  styleUrls: ['./list-incidents.component.css']
})
export class ListIncidentsComponent implements OnInit {
  incidents: Incident[] = [];
  immeubles: Immeuble[] = [];
  filteredIncidents: Incident[] = [];
  searchTerm: string = '';
  filterImmeuble: string = '';
  filterPriority: string = '';
  filterStatus: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private incidentService: IncidentService,
    private immeubleService: ImmeubleService
  ) {}

  ngOnInit(): void {
    this.loadIncidents();
    this.loadImmeubles();
  }

  getImmeubleName(immeubleId: number): string {
    const immeuble = this.immeubles.find(i => i.id === immeubleId);
    return immeuble ? immeuble.nom : 'Immeuble non trouvé';
  }

  loadImmeubles(): void {
    this.immeubleService.getAllImmeubles().subscribe({
      next: (data) => {
        this.immeubles = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des immeubles:', error);
      }
    });
  }

  loadIncidents(): void {
    this.incidentService.getAllIncidents().subscribe({
      next: (data) => {
        this.incidents = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des incidents:', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredIncidents = this.incidents.filter(incident => {
      const matchesSearch = !this.searchTerm || 
        incident.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.filterStatus || incident.statut === this.filterStatus;
      const matchesPriority = !this.filterPriority || incident.priorite === this.filterPriority;
      const matchesImmeuble = !this.filterImmeuble || incident.immeubleId.toString() === this.filterImmeuble;

      return matchesSearch && matchesStatus && matchesPriority && matchesImmeuble;
    });

    // Mise à jour de la pagination
    this.totalPages = Math.ceil(this.filteredIncidents.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  onSearch(): void {
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'NOUVEAU':
        return 'bg-blue-100 text-blue-800';
      case 'EN_COURS':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLU':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityClass(priority: string): string {
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

  openAddIncidentModal(): void {
    // TODO: Implémenter l'ouverture du modal
  }

  viewIncidentDetails(incident: Incident): void {
    // TODO: Implémenter la vue des détails
  }

  updateIncidentStatus(incident: Incident): void {
    const newStatus = incident.statut === 'NOUVEAU' ? 'EN_COURS' : 'RESOLU';
    this.incidentService.updateIncidentStatus(incident.id, newStatus).subscribe({
      next: () => {
        incident.statut = newStatus;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
      }
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
} 