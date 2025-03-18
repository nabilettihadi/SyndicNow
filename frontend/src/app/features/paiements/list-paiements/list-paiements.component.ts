import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaiementService } from '../../../core/services/paiement.service';
import { Paiement } from '../../../core/models/paiement.model';

@Component({
  selector: 'app-list-paiements',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './list-paiements.component.html',
  styleUrls: ['./list-paiements.component.css']
})
export class ListPaiementsComponent implements OnInit {
  paiements: Paiement[] = [];
  filteredPaiements: Paiement[] = [];
  searchTerm: string = '';
  selectedLocataire: string = '';
  selectedStatut: string = '';
  selectedMois: string = '';
  selectedAnnee: string = new Date().getFullYear().toString();

  mois = [
    { value: '01', label: 'Janvier' },
    { value: '02', label: 'Février' },
    { value: '03', label: 'Mars' },
    { value: '04', label: 'Avril' },
    { value: '05', label: 'Mai' },
    { value: '06', label: 'Juin' },
    { value: '07', label: 'Juillet' },
    { value: '08', label: 'Août' },
    { value: '09', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' }
  ];

  annees = Array.from(
    { length: 5 },
    (_, i) => (new Date().getFullYear() - 2 + i).toString()
  );

  constructor(private paiementService: PaiementService) {}

  ngOnInit(): void {
    this.loadPaiements();
  }

  loadPaiements(): void {
    this.paiementService.getAllPaiements().subscribe({
      next: (data) => {
        this.paiements = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des paiements:', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredPaiements = this.paiements.filter(paiement => {
      const matchesSearch = !this.searchTerm || 
        paiement.reference.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        paiement.locataire.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        paiement.locataire.prenom.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesLocataire = !this.selectedLocataire || 
        paiement.locataire.id.toString() === this.selectedLocataire;

      const matchesStatut = !this.selectedStatut || 
        paiement.statut === this.selectedStatut;

      const date = new Date(paiement.datePaiement);
      const matchesMois = !this.selectedMois || 
        (date.getMonth() + 1).toString().padStart(2, '0') === this.selectedMois;
      
      const matchesAnnee = !this.selectedAnnee || 
        date.getFullYear().toString() === this.selectedAnnee;

      return matchesSearch && matchesLocataire && matchesStatut && matchesMois && matchesAnnee;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onLocataireChange(): void {
    this.applyFilters();
  }

  onStatutChange(): void {
    this.applyFilters();
  }

  onMoisChange(): void {
    this.applyFilters();
  }

  onAnneeChange(): void {
    this.applyFilters();
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'PAYE':
        return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'EN_RETARD':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  formatMontant(montant: number): string {
    return `${montant.toLocaleString('fr-FR')} €`;
  }
} 