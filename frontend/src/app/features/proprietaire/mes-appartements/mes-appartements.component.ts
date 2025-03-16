import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AppartementService } from '../../../core/services/appartement.service';
import { AuthService } from '../../../core/services/auth.service';

export interface Appartement {
  id: number;
  numero: string;
  surface: number;
  etage: number;
  charges: number;
  residence: string;
  statut: 'OCCUPE' | 'LIBRE';
  etatPaiements: 'A_JOUR' | 'EN_RETARD';
  image?: string;
}

@Component({
  selector: 'app-mes-appartements',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './mes-appartements.component.html',
  styleUrls: ['./mes-appartements.component.css']
})
export class MesAppartementsComponent implements OnInit {
  appartements: Appartement[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private appartementService: AppartementService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAppartements();
  }

  private loadAppartements() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.userId) {
      this.error = 'Utilisateur non connecté';
      return;
    }

    this.loading = true;
    this.error = null;

    this.appartementService.getAppartementsProprietaire(currentUser.userId)
      .subscribe({
        next: (data) => {
          this.appartements = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des appartements:', error);
          this.error = 'Impossible de charger vos appartements. Veuillez réessayer plus tard.';
          this.loading = false;
        }
      });
  }
} 