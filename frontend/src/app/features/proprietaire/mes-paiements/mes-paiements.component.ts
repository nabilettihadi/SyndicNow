import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { PaiementService } from '../../../core/services/paiement.service';
import { AuthService } from '../../../core/services/auth.service';
import { IPaiement, PaiementType, PaiementStats } from './models/paiement.model';

@Component({
  selector: 'app-mes-paiements',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './mes-paiements.component.html',
  styleUrls: ['./mes-paiements.component.css']
})
export class MesPaiementsComponent implements OnInit {
  paiements: IPaiement[] = [];
  filteredPaiements: IPaiement[] = [];
  selectedType: PaiementType | '' = '';
  selectedPeriod: string = '';
  
  stats: PaiementStats = {
    prochainPaiement: null,
    totalPaye: 0,
    nombrePaiements: 0,
    etatPaiements: 'A_JOUR',
    paiementsEnRetard: 0
  };

  currentYear: number = new Date().getFullYear();
  loading = false;
  error: string | null = null;

  constructor(
    private paiementService: PaiementService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPaiements();
  }

  private loadPaiements() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.userId) {
      this.error = 'Utilisateur non connecté';
      return;
    }

    this.loading = true;
    this.error = null;

    this.paiementService.getPaiementsByProprietaire(currentUser.userId)
      .subscribe({
        next: (data) => {
          this.paiements = data.map(p => ({
            ...p,
            proprietaireId: currentUser.userId,
            immeubleId: (p as any).immeuble?.id || 0
          })) as IPaiement[];
          this.filterPaiements();
          this.updateStatistics();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des paiements:', error);
          this.error = 'Impossible de charger vos paiements. Veuillez réessayer plus tard.';
          this.loading = false;
        }
      });
  }

  filterPaiements() {
    this.filteredPaiements = this.paiements.filter(paiement => {
      const typeMatch = !this.selectedType || paiement.type === this.selectedType;
      const periodMatch = !this.selectedPeriod || 
        new Date(paiement.date).toISOString().substring(0, 7) === this.selectedPeriod;
      return typeMatch && periodMatch;
    });
  }

  updateStatistics() {
    // Prochain paiement
    this.stats.prochainPaiement = this.paiements
      .filter(p => p.status === 'EN_ATTENTE')
      .sort((a, b) => new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime())[0] || null;

    // Total payé cette année
    const paiementsAnnee = this.paiements.filter(p => 
      new Date(p.date).getFullYear() === this.currentYear && 
      p.status === 'PAYE'
    );
    this.stats.totalPaye = paiementsAnnee.reduce((sum, p) => sum + p.montant, 0);
    this.stats.nombrePaiements = paiementsAnnee.length;

    // État des paiements
    this.stats.paiementsEnRetard = this.paiements.filter(p => p.status === 'EN_RETARD').length;
    this.stats.etatPaiements = this.stats.paiementsEnRetard > 0 ? 'EN_RETARD' : 'A_JOUR';
  }

  downloadRecu(paiement: IPaiement) {
    this.loading = true;
    this.error = null;

    this.paiementService.downloadRecu(paiement.id)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = window.document.createElement('a');
          a.href = url;
          a.download = `recu-paiement-${paiement.id}.pdf`;
          window.document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          window.document.body.removeChild(a);
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du téléchargement du reçu:', error);
          this.error = 'Impossible de télécharger le reçu. Veuillez réessayer plus tard.';
          this.loading = false;
        }
      });
  }

  getStatusStyle(status: string): { bgColor: string; textColor: string } {
    switch (status) {
      case 'PAYE':
        return { bgColor: 'bg-green-100', textColor: 'text-green-800' };
      case 'EN_ATTENTE':
        return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
      case 'EN_RETARD':
        return { bgColor: 'bg-red-100', textColor: 'text-red-800' };
      default:
        return { bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'PAYE':
        return 'Payé';
      case 'EN_ATTENTE':
        return 'En attente';
      case 'EN_RETARD':
        return 'En retard';
      case 'ANNULE':
        return 'Annulé';
      default:
        return status;
    }
  }
} 