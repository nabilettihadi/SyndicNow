import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppartementService } from '../../../core/services/appartement.service';
import { Appartement } from '../../../core/models/appartement.model';

@Component({
  selector: 'app-list-appartements',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './list-appartements.component.html',
  styleUrls: ['./list-appartements.component.css']
})
export class ListAppartementsComponent implements OnInit {
  appartements: Appartement[] = [];
  filteredAppartements: Appartement[] = [];
  searchTerm: string = '';
  selectedEtage: string = '';
  selectedStatut: string = '';

  constructor(private appartementService: AppartementService) {}

  ngOnInit(): void {
    this.loadAppartements();
  }

  loadAppartements(): void {
    this.appartementService.getAllAppartements().subscribe({
      next: (data) => {
        this.appartements = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des appartements:', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredAppartements = this.appartements.filter(appartement => {
      const matchesSearch = !this.searchTerm || 
        appartement.numero.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        appartement.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesEtage = !this.selectedEtage || 
        appartement.etage.toString() === this.selectedEtage;

      const matchesStatut = !this.selectedStatut || 
        appartement.statut === this.selectedStatut;

      return matchesSearch && matchesEtage && matchesStatut;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onEtageChange(): void {
    this.applyFilters();
  }

  onStatutChange(): void {
    this.applyFilters();
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'LIBRE':
        return 'bg-green-100 text-green-800';
      case 'OCCUPE':
        return 'bg-blue-100 text-blue-800';
      case 'EN_TRAVAUX':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatSurface(surface: number): string {
    return `${surface} m²`;
  }

  formatLoyer(loyer: number): string {
    return `${loyer.toLocaleString('fr-FR')} €`;
  }
} 