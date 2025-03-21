import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImmeubleService } from '@core/services/immeuble.service';
import { Immeuble } from '@core/models/immeuble.model';

interface ImmeubleStats {
  total: number;
  actifs: number;
  enConstruction: number;
  inactifs: number;
}

@Component({
  selector: 'app-list-immeubles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list-immeubles.component.html'
})
export class ListImmeublesComponent implements OnInit {
  
  // Propriétés de la classe
  immeubles: Immeuble[] = [];
  filteredImmeubles: Immeuble[] = [];
  stats: ImmeubleStats = {
    total: 0,
    actifs: 0,
    enConstruction: 0,
    inactifs: 0
  };
  searchTerm: string = '';
  filterStatus: string = '';
  filterVille: string = '';
  villes: string[] = [];
  isLoading: boolean = true;

  constructor(private immeubleService: ImmeubleService) {}

  ngOnInit(): void {
    this.loadImmeubles();
  }

  loadImmeubles(): void {
    this.isLoading = true;
    this.immeubleService.getAllImmeubles().subscribe(
      (immeubles: Immeuble[]) => {
        this.immeubles = immeubles;
        this.filteredImmeubles = [...this.immeubles];
        this.calculateStats();
        this.extractVilles();
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des immeubles', error);
        this.isLoading = false;
      }
    );
  }

  calculateStats(): void {
    this.stats.total = this.immeubles.length;
    this.stats.actifs = this.immeubles.filter(imm => imm.status === 'ACTIF').length;
    this.stats.enConstruction = this.immeubles.filter(imm => imm.status === 'EN_TRAVAUX').length;
    this.stats.inactifs = this.immeubles.filter(imm => imm.status === 'INACTIF').length;
  }

  extractVilles(): void {
    this.villes = [...new Set(this.immeubles.map(imm => imm.ville))];
  }

  applyFilters(): void {
    this.filteredImmeubles = this.immeubles.filter(immeuble => {
      const matchesSearch = this.searchTerm ? 
        (immeuble.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
         immeuble.adresse.toLowerCase().includes(this.searchTerm.toLowerCase())) : 
        true;
      
      const matchesStatus = this.filterStatus ? 
        immeuble.status === this.filterStatus : 
        true;
      
      const matchesVille = this.filterVille ? 
        immeuble.ville === this.filterVille : 
        true;
      
      return matchesSearch && matchesStatus && matchesVille;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterStatus = '';
    this.filterVille = '';
    this.filteredImmeubles = [...this.immeubles];
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'ACTIF':
        return 'bg-green-100 text-green-800';
      case 'EN_TRAVAUX':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIF':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatStatus(status: string): string {
    switch(status) {
      case 'ACTIF':
        return 'Actif';
      case 'EN_TRAVAUX':
        return 'En travaux';
      case 'INACTIF':
        return 'Inactif';
      default:
        return status;
    }
  }
} 