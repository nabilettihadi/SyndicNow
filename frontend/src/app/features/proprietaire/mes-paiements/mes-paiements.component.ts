import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {FooterComponent} from '@shared/components/footer/footer.component';
import {PaiementService} from '@core/services/paiement.service';
import {AuthService} from '@core/services/auth.service';
import {IPaiement, PaiementStats} from '@core/models/paiement.model';

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
  selectedType: 'LOYER' | 'CHARGES' | 'AUTRE' | '' = '';
  selectedPeriod: string = '';

  stats: PaiementStats = {
    total: 0,
    parStatus: {},
    parType: {},
    parImmeuble: {},
    montantTotal: 0,
    montantMoyen: 0
  };

  currentYear: number = new Date().getFullYear();
  loading = false;
  error: string | null = null;

  // Ajout de la méthode pour accéder à Object.entries dans le template
  protected readonly Object = Object;

  constructor(
    private paiementService: PaiementService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.loadPaiements();
  }

  private loadPaiements(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser?.userId) {
      this.paiementService.getPaiementsByProprietaire(currentUser.userId).subscribe({
        next: (data) => {
          this.paiements = data.map(p => ({
            ...p,
            dateEcheance: new Date(p.datePaiement).toISOString(),
            immeubleId: p.immeuble?.id || 0,
            date: new Date(p.datePaiement).toISOString()
          })) as unknown as IPaiement[];
          this.filterPaiements();
          this.updateStatistics();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des paiements';
          this.loading = false;
        }
      });
    }
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
    // Statistiques générales
    this.stats.total = this.paiements.length;
    this.stats.montantTotal = this.paiements.reduce((sum, p) => sum + p.montant, 0);
    this.stats.montantMoyen = this.stats.total > 0 ? this.stats.montantTotal / this.stats.total : 0;

    // Statistiques par statut
    this.stats.parStatus = this.paiements.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Statistiques par type
    this.stats.parType = this.paiements.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Statistiques par immeuble
    this.stats.parImmeuble = this.paiements.reduce((acc, p) => {
      const immeubleId = p.immeuble?.id || 'autre';
      acc[immeubleId] = (acc[immeubleId] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
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

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PAYE':
        return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'RETARDE':
        return 'bg-red-100 text-red-800';
      case 'ANNULE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusStyle(status: string): string {
    switch (status) {
      case 'PAYE':
        return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'RETARDE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'PAYE':
        return 'Payé';
      case 'EN_ATTENTE':
        return 'En attente';
      case 'RETARDE':
        return 'Retardé';
      default:
        return status;
    }
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(montant);
  }
}
