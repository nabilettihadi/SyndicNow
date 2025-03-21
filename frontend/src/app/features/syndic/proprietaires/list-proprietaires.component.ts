import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { ProprietaireService } from '@core/services/proprietaire.service';
import { Proprietaire } from '@core/models/proprietaire.model';

@Component({
  selector: 'app-list-proprietaires',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './list-proprietaires.component.html',
  styleUrls: []
})
export class ListProprietairesComponent implements OnInit {
  syndicId: number = 1; // À remplacer par l'ID du syndic actuel
  isLoading = true;
  hasError = false;
  errorMessage = '';
  
  proprietaires: Proprietaire[] = [];
  filteredProprietaires: Proprietaire[] = [];
  searchTerm: string = '';
  villeFilter: string = 'ALL';

  constructor(private proprietaireService: ProprietaireService) {}

  ngOnInit(): void {
    this.loadProprietaires();
  }

  loadProprietaires(): void {
    this.proprietaireService.getAllProprietaires().subscribe({
      next: (data) => {
        this.proprietaires = data;
        this.filteredProprietaires = [...this.proprietaires];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des propriétaires:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Une erreur est survenue lors du chargement des propriétaires';
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim() && this.villeFilter === 'ALL') {
      this.filteredProprietaires = [...this.proprietaires];
      return;
    }
    
    let filtered = [...this.proprietaires];
    
    // Filtre par ville
    if (this.villeFilter !== 'ALL') {
      filtered = filtered.filter(proprietaire => proprietaire.ville === this.villeFilter);
    }
    
    // Filtre par texte de recherche
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(proprietaire => 
        proprietaire.nom.toLowerCase().includes(searchLower) || 
        proprietaire.prenom.toLowerCase().includes(searchLower) ||
        proprietaire.email.toLowerCase().includes(searchLower) ||
        proprietaire.telephone.toLowerCase().includes(searchLower) ||
        (proprietaire.adresse ? proprietaire.adresse.toLowerCase().includes(searchLower) : false)
      );
    }
    
    this.filteredProprietaires = filtered;
  }

  getVilles(): string[] {
    const villesSet = new Set<string>();
    this.proprietaires.forEach(proprietaire => {
      if (proprietaire.ville) {
        villesSet.add(proprietaire.ville);
      }
    });
    return Array.from(villesSet).sort();
  }
} 