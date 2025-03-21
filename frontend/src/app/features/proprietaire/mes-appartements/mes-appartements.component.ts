import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {FooterComponent} from '@shared/components/footer/footer.component';
import {AppartementService} from '@core/services/appartement.service';
import {AuthService} from '@core/services/auth.service';
import {Appartement} from '@core/models/appartement.model';

export interface AppartementDetails {
  id: number;
  numero: string;
  etage: number;
  superficie: number;
  immeubleId: number;
  immeubleName: string;
  proprietaireId: number;
  proprietaireName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
}

@Component({
  selector: 'app-mes-appartements',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './mes-appartements.component.html'
})
export class MesAppartementsComponent implements OnInit {
  appartements: AppartementDetails[] = [];
  loading = false;
  error: string | null = null;

  // Statistiques calculées
  get totalAppartements(): number {
    return this.appartements.length;
  }

  get appartementsOccupes(): number {
    return this.appartements.filter(a => a.status === 'OCCUPE').length;
  }

  get appartementsLibres(): number {
    return this.appartements.filter(a => a.status === 'LIBRE').length;
  }

  constructor(
    private appartementService: AppartementService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.loadAppartements();
  }

  private loadAppartements(): void {
    const userId = this.authService.currentUserValue?.userId;
    if (!userId) return;

    this.loading = true;
    this.appartementService.getAppartementsProprietaire(userId).subscribe({
      next: (data: any) => {
        this.appartements = data as AppartementDetails[];
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Erreur lors du chargement des appartements';
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'OCCUPE':
        return 'bg-green-100 text-green-800';
      case 'LIBRE':
        return 'bg-blue-100 text-blue-800';
      case 'EN_TRAVAUX':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getEtageLabel(etage: number): string {
    if (etage === -1) return 'Sous-sol';
    if (etage === 0) return 'RDC';
    return `Étage ${etage}`;
  }
}
