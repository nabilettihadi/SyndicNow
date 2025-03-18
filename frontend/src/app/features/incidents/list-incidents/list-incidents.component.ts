import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IncidentService } from '../../../core/services/incident.service';
import { Incident } from '../../../core/models/incident.model';

@Component({
  selector: 'app-list-incidents',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './list-incidents.component.html',
  styleUrls: ['./list-incidents.component.css']
})
export class ListIncidentsComponent implements OnInit {
  incidents: Incident[] = [];
  filteredIncidents: Incident[] = [];
  searchTerm: string = '';
  selectedStatus: string = '';
  selectedPriority: string = '';
  selectedType: string = '';

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.loadIncidents();
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
      
      const matchesStatus = !this.selectedStatus || incident.statut === this.selectedStatus;
      const matchesPriority = !this.selectedPriority || incident.priorite === this.selectedPriority;
      const matchesType = !this.selectedType || incident.type === this.selectedType;

      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  onPriorityChange(): void {
    this.applyFilters();
  }

  onTypeChange(): void {
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'EN_COURS':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLU':
        return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'HAUTE':
        return 'bg-red-100 text-red-800';
      case 'MOYENNE':
        return 'bg-orange-100 text-orange-800';
      case 'BASSE':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
} 