import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Appartement {
  numero: string;
  immeuble: string;
}

interface Proprietaire {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  appartements: Appartement[];
}

interface Immeuble {
  id: number;
  nom: string;
}

@Component({
  selector: 'app-list-proprietaires',
  templateUrl: './list-proprietaires.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ListProprietairesComponent implements OnInit {
  // Données
  proprietaires: Proprietaire[] = [];
  immeubles: Immeuble[] = [];
  filteredProprietaires: Proprietaire[] = [];
  villes: string[] = [];

  // Filtres
  searchTerm: string = '';
  filterImmeuble: string = '';
  filterVille: string = '';
  sortBy: string = 'nom';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 1;

  constructor() {}

  ngOnInit(): void {
    // Simuler le chargement des données
    this.loadProprietaires();
    this.loadImmeubles();
    this.extractVilles();
  }

  loadProprietaires(): void {
    // Simulation de données
    this.proprietaires = [
      {
        id: 1,
        nom: 'John Doe',
        email: 'john.doe@example.com',
        telephone: '+212 6XX-XXXXXX',
        ville: 'Casablanca',
        appartements: [
          { numero: 'A101', immeuble: 'Résidence Atlas' },
          { numero: 'B202', immeuble: 'Résidence Oasis' }
        ]
      },
      // Ajouter plus de propriétaires...
    ];
    this.applyFilters();
  }

  loadImmeubles(): void {
    // Simulation de données
    this.immeubles = [
      { id: 1, nom: 'Résidence Atlas' },
      { id: 2, nom: 'Résidence Oasis' },
      // Ajouter plus d'immeubles...
    ];
  }

  extractVilles(): void {
    // Extraire les villes uniques des propriétaires
    this.villes = Array.from(new Set(this.proprietaires.map(p => p.ville))).sort();
  }

  applyFilters(): void {
    let filtered = [...this.proprietaires];

    // Recherche
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(search) ||
        p.email.toLowerCase().includes(search) ||
        p.telephone.includes(search)
      );
    }

    // Filtre par immeuble
    if (this.filterImmeuble) {
      filtered = filtered.filter(p => 
        p.appartements.some(a => a.immeuble === this.filterImmeuble)
      );
    }

    // Filtre par ville
    if (this.filterVille) {
      filtered = filtered.filter(p => p.ville === this.filterVille);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'nom':
          return a.nom.localeCompare(b.nom);
        case 'ville':
          return a.ville.localeCompare(b.ville);
        case 'appartements':
          return b.appartements.length - a.appartements.length;
        default:
          return 0;
      }
    });

    // Pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredProprietaires = filtered.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  openAddProprietaireModal(): void {
    // Implémenter la logique d'ouverture du modal
  }

  viewProprietaireDetails(proprietaire: Proprietaire): void {
    // Implémenter la logique d'affichage des détails
  }

  editProprietaire(proprietaire: Proprietaire): void {
    // Implémenter la logique d'édition
  }
} 