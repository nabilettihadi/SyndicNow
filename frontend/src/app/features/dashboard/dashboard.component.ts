import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {AuthState} from '../auth/models/auth.model';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {DashboardService} from './services/dashboard.service';
import {RouterModule, Router} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule]
})
export class DashboardComponent implements OnInit, OnDestroy {
  userRole$: Observable<string | null>;
  userName$: Observable<string | null>;
  loading = false;
  private subscription = new Subscription();

  // Statistiques pour l'admin
  totalUsers = 0;
  activeUsers = 0;
  totalSyndics = 0;
  totalProprietaires = 0;

  // Statistiques pour le syndic
  totalImmeubles = 0;
  totalAppartements = 0;
  totalCharges = 0;
  totalPaiements = 0;

  // Statistiques pour le propriétaire
  mesAppartements = 0;
  paiementsEnAttente = 0;
  chargesImpayees = 0;
  documentsDisponibles = 0;

  constructor(
    private store: Store<{ auth: AuthState }>,
    private dashboardService: DashboardService,
    private router: Router,
    public authService: AuthService
  ) {
    this.userRole$ = this.store.select(state => state.auth.user?.role ?? null);
    this.userName$ = this.store.select(state =>
      state.auth.user ? `${state.auth.user.prenom} ${state.auth.user.nom}` : null
    );

    // Vérifier l'état de l'authentification au démarrage
    const currentUser = this.authService.getCurrentUser();
    console.log('=== État de l\'authentification ===');
    console.log('Utilisateur actuel:', currentUser);
    console.log('Est authentifié:', this.authService.isAuthenticated());
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadDashboardData(): void {
    this.loading = true;
    const roleSub = this.userRole$.subscribe(role => {
      if (!role) return;

      switch (role) {
        case 'ADMIN':
          this.loadAdminData();
          break;
        case 'SYNDIC':
          this.loadSyndicData();
          break;
        case 'PROPRIETAIRE':
          this.loadProprietaireData();
          break;
      }
    });
    this.subscription.add(roleSub);
  }

  private loadAdminData(): void {
    const adminSub = this.dashboardService.getAdminStats().subscribe({
      next: (stats) => {
        this.totalUsers = stats.totalUsers;
        this.activeUsers = stats.activeUsers;
        this.totalSyndics = stats.totalSyndics;
        this.totalProprietaires = stats.totalProprietaires;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques admin:', error);
        this.loading = false;
      }
    });
    this.subscription.add(adminSub);
  }

  private loadSyndicData(): void {
    const syndicSub = this.dashboardService.getSyndicStats().subscribe({
      next: (stats) => {
        this.totalImmeubles = stats.totalImmeubles;
        this.totalAppartements = stats.totalAppartements;
        this.totalCharges = stats.totalCharges;
        this.totalPaiements = stats.totalPaiements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques syndic:', error);
        this.loading = false;
      }
    });
    this.subscription.add(syndicSub);
  }

  private loadProprietaireData(): void {
    const propSub = this.dashboardService.getProprietaireStats().subscribe({
      next: (stats) => {
        this.mesAppartements = stats.mesAppartements;
        this.paiementsEnAttente = stats.paiementsEnAttente;
        this.chargesImpayees = stats.chargesImpayees;
        this.documentsDisponibles = stats.documentsDisponibles;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques propriétaire:', error);
        this.loading = false;
      }
    });
    this.subscription.add(propSub);
  }

  navigateToImmeubles(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('=== Tentative de navigation vers Immeubles ===');
    console.log('Utilisateur:', currentUser);
    console.log('Est authentifié:', this.authService.isAuthenticated());

    if (!this.authService.isAuthenticated()) {
      console.log('⚠️ Utilisateur non authentifié');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.userRole$.subscribe(role => {
      console.log('Rôle actuel:', role);
      if (role === 'SYNDIC') {
        console.log('✅ Navigation vers /immeubles autorisée');
        this.router.navigate(['/immeubles']);
      } else {
        console.log('⛔ Accès refusé - Rôle incorrect');
        // Optionnel : afficher un message d'erreur
      }
    }).unsubscribe();
  }
}
