import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LocataireService } from '../../../core/services/locataire.service';
import { Locataire } from '../../../core/models/locataire.model';

@Component({
  selector: 'app-list-locataires',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './list-locataires.component.html',
  styleUrls: ['./list-locataires.component.css']
})
export class ListLocatairesComponent implements OnInit {
  locataires: Locataire[] = [];
  filteredLocataires: Locataire[] = [];
  searchTerm: string = '';
  selectedAppartement: string = '';
  selectedStatut: string = '';
  loading = false;
  error: string | null = null;

  constructor(
    private locataireService: LocataireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLocataires();
  }

  private loadLocataires(): void {
    this.loading = true;
    this.locataireService.getAllLocataires().subscribe({
      next: (data: Locataire[]) => {
        this.locataires = data;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Erreur lors du chargement des locataires';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredLocataires = this.locataires.filter(locataire => {
      const matchesSearch = !this.searchTerm || 
        locataire.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        locataire.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        locataire.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesAppartement = !this.selectedAppartement || 
        (locataire.appartement && locataire.appartement.id.toString() === this.selectedAppartement);

      const isActif = !locataire.dateSortie || new Date(locataire.dateSortie) > new Date();
      const matchesStatut = !this.selectedStatut || 
        (this.selectedStatut === 'ACTIF' && isActif) ||
        (this.selectedStatut === 'INACTIF' && !isActif);

      return matchesSearch && matchesAppartement && matchesStatut;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onAppartementChange(): void {
    this.applyFilters();
  }

  onStatutChange(): void {
    this.applyFilters();
  }

  terminerBail(locataire: Locataire): void {
    if (confirm(`Êtes-vous sûr de vouloir terminer le bail de ${locataire.nom} ${locataire.prenom} ?`)) {
      const updatedLocataire: Partial<Locataire> = {
        ...locataire,
        dateSortie: new Date(),
        status: 'INACTIF'
      };
      this.locataireService.updateLocataire(locataire.id, updatedLocataire).subscribe({
        next: () => {
          this.loadLocataires();
        },
        error: (error: Error) => {
          console.error('Erreur lors de la terminaison du bail:', error);
        }
      });
    }
  }

  getStatutClass(locataire: Locataire): string {
    const isActif = !locataire.dateSortie || new Date(locataire.dateSortie) > new Date();
    return isActif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getStatutText(locataire: Locataire): string {
    const isActif = !locataire.dateSortie || new Date(locataire.dateSortie) > new Date();
    return isActif ? 'Actif' : 'Inactif';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  isLocataireActif(locataire: Locataire): boolean {
    return locataire.status === 'ACTIF';
  }

  updateLocataireStatus(locataire: Locataire, newStatus: 'ACTIF' | 'INACTIF'): void {
    this.locataireService.updateLocataire(locataire.id, { status: newStatus }).subscribe({
      next: () => {
        this.loadLocataires();
      },
      error: (error: Error) => {
        this.error = 'Erreur lors de la mise à jour du statut';
      }
    });
  }
} 