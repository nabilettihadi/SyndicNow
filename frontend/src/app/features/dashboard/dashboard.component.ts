import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, switchMap, forkJoin, of, catchError } from 'rxjs';
import { AuthState, LoginResponse, UserRole } from '../../core/authentication/models/auth.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { inject } from '@angular/core';
import { ImmeubleService } from '../../core/services/immeuble.service';
import { PaiementService } from '../../core/services/paiement.service';
import { ProprietaireService } from '../../core/services/proprietaire.service';
import { Immeuble, ImmeubleStatistics } from '../../core/models/immeuble.model';
import { Paiement, PaiementStatistics } from '../../core/models/paiement.model';
import { Proprietaire, ProprietaireStatistics } from '../../core/models/proprietaire.model';
import { DashboardStats } from '../../core/models/dashboard.model';
import { selectAuthState } from '../../core/authentication/store/selectors/auth.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  hasError = false;
  errorMessage = '';
  userName$: Observable<string>;
  userRole$: Observable<UserRole>;
  dashboardStats!: DashboardStats;

  // Injection des services
  private readonly immeubleService = inject(ImmeubleService);
  private readonly paiementService = inject(PaiementService);
  private readonly proprietaireService = inject(ProprietaireService);
  private readonly store = inject(Store<{ auth: AuthState }>);
  private readonly router = inject(Router);

  constructor() {
    this.userName$ = this.store.select(selectAuthState).pipe(
      map(state => state.user ? `${state.user.prenom} ${state.user.nom}` : '')
    );
    this.userRole$ = this.store.select(selectAuthState).pipe(
      map(state => state.user?.role || 'PROPRIETAIRE')
    );
    this.dashboardStats = {
      statistiques: {},
      revenueGrowth: 0,
      syndicsCount: 0,
      totalBuildings: 0,
      activeBuildings: 0,
      revenue: 0,
      buildingsCount: 0,
      ownersCount: 0,
      monthlyPayments: 0,
      paymentPercentage: 0,
      apartmentsCount: 0,
      pendingPayments: 0,
      totalPaid: 0,
      activeSyndics: 0,
      pendingSyndics: 0,
      reportsCount: 0,
      monthlyReports: 0,
      buildingsInMaintenance: 0,
      pendingAmount: 0,
      latePayments: 0,
      totalArea: 0,
      amountDue: 0
    };
  }

  ngOnInit(): void {
    this.loadStats();
  }

  navigateToImmeubles(): void {
    this.router.navigate(['/syndic/immeubles']);
  }

  navigateToPaiements(): void {
    this.router.navigate(['/syndic/paiements']);
  }

  navigateToCharges(): void {
    this.router.navigate(['/syndic/charges']);
  }

  logout(): void {
    // Implémentez la logique de déconnexion ici
    this.router.navigate(['/auth/login']);
  }

  private loadStats(): void {
    this.userRole$.pipe(
      switchMap(role => {
        switch (role) {
          case 'ADMIN':
            return this.loadAdminStats();
          case 'SYNDIC':
            return this.loadSyndicStats();
          case 'PROPRIETAIRE':
            return this.loadProprietaireStats();
          default:
            return of({} as DashboardStats);
        }
      })
    ).subscribe({
      next: (stats) => {
        this.dashboardStats = { ...this.dashboardStats, ...stats };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors du chargement des données';
      }
    });
  }

  private loadAdminStats(): Observable<DashboardStats> {
    return forkJoin({
      immeubles: this.immeubleService.getAllImmeubles(),
      paiementsStats: this.paiementService.getPaiementStatistics(),
      proprietairesStats: this.proprietaireService.getProprietaireStatistics(),
      statistiques: forkJoin({
        totalImmeubles: this.immeubleService.getImmeubleStatistics(),
        totalPaiements: this.paiementService.getPaiementStatistics(),
        totalProprietaires: this.proprietaireService.getProprietaireStatistics()
      })
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des statistiques admin:', error);
        throw error;
      })
    ) as Observable<DashboardStats>;
  }

  private loadSyndicStats(): Observable<DashboardStats> {
    const userId = this.getCurrentUserId();
    return forkJoin({
      immeubles: this.immeubleService.getImmeublesBySyndic(userId),
      paiementsRecents: this.paiementService.getAllPaiements()
    }).pipe(
      map(data => {
        const paiementsRecents = Array.isArray(data.paiementsRecents) ? data.paiementsRecents : [];
        return {
          buildingsCount: data.immeubles.length,
          pendingPayments: paiementsRecents.filter(p => p.status === 'EN_ATTENTE').length,
          apartmentsCount: data.immeubles.reduce((acc, imm) => acc + (imm.nombreAppartements || 0), 0)
        } as DashboardStats;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des statistiques syndic:', error);
        throw error;
      })
    );
  }

  private loadProprietaireStats(): Observable<DashboardStats> {
    const userId = this.getCurrentUserId();
    return forkJoin({
      mesPaiements: this.paiementService.getPaiementsByProprietaire(userId),
      mesAppartements: this.proprietaireService.getProprietaireById(userId),
      statistiques: forkJoin({
        totalPaiements: this.paiementService.getPaiementStatistics(),
        prochainsDelais: this.paiementService.getPaiementStatistics()
      })
    }).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des statistiques propriétaire:', error);
        throw error;
      })
    ) as Observable<DashboardStats>;
  }

  private getCurrentUserId(): number {
    let userId = 0;
    this.store.select(selectAuthState).pipe(
      map(state => state.user?.userId)
    ).subscribe(id => {
      if (id) userId = Number(id);
    });
    return userId;
  }

  hasRole(role: UserRole): Observable<boolean> {
    return this.store.select(selectAuthState).pipe(
      map(state => state.user?.role === role)
    );
  }
}
