import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProprietaireService } from '@core/services/proprietaire.service';
import { Proprietaire } from '@core/models/proprietaire.model';

@Component({
  selector: 'app-list-proprietaires',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-proprietaires.component.html'
})
export class ListProprietairesComponent implements OnInit {
  proprietaires: Proprietaire[] = [];
  filteredProprietaires: Proprietaire[] = [];
  isLoading = true;
  error: string | null = null;
  searchTerm = '';

  constructor(private proprietaireService: ProprietaireService) {}

  ngOnInit(): void {
    this.loadProprietaires();
  }

  loadProprietaires(): void {
    this.isLoading = true;
    this.proprietaireService.getAllProprietaires().subscribe({
      next: (data) => {
        this.proprietaires = data;
        this.filteredProprietaires = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des propriétaires:', error);
        this.error = 'Impossible de charger les propriétaires. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProprietaires = [...this.proprietaires];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredProprietaires = this.proprietaires.filter(proprietaire =>
      proprietaire.nom.toLowerCase().includes(searchLower) ||
      proprietaire.prenom.toLowerCase().includes(searchLower) ||
      proprietaire.email.toLowerCase().includes(searchLower)
    );
  }
}
