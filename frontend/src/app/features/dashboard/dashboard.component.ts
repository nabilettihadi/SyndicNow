import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {AuthState} from '../auth/models/auth.model';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {DashboardService} from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent]
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
    private dashboardService: DashboardService
  ) {
    this.userRole$ = this.store.select(state => state.auth.user?.role ?? null);
    this.userName$ = this.store.select(state =>
      state.auth.user ? `${state.auth.user.prenom} ${state.auth.user.nom}` : null
    );
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
}
