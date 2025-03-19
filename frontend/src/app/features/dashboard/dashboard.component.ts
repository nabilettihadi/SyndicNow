import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Store} from '@ngrx/store';
import {catchError, forkJoin, map, Observable, of, switchMap} from 'rxjs';
import {AuthState, UserRole} from '@core/authentication/models/auth.model';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {FooterComponent} from '@shared/components/footer/footer.component';
import {ImmeubleService} from '@core/services/immeuble.service';
import {PaiementService} from '@core/services/paiement.service';
import {ProprietaireService} from '@core/services/proprietaire.service';
import {DashboardStats} from '@core/models/dashboard.model';
import {selectAuthState} from '@core/authentication/store/selectors/auth.selectors';
import {AuthService} from '../../core/services/auth.service';
import {IncidentService} from '../../core/services/incident.service';
import {LocataireService} from '../../core/services/locataire.service';
import {AppartementService} from '../../core/services/appartement.service';
import {MessageService} from '../../core/services/message.service';

interface AdminStats {
  totalBuildings: number;
  ownersCount: number;
  monthlyPayments: number;
  activeIncidents: number;
}

interface Incident {
  type: string;
  building: string;
  status: 'EN_COURS' | 'EN_ATTENTE' | 'RESOLU';
  date: Date;
}

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
  userRole: string = '';

  adminStats: AdminStats = {
    totalBuildings: 0,
    ownersCount: 0,
    monthlyPayments: 0,
    activeIncidents: 0
  };

  recentIncidents: Incident[] = [
    {
      type: 'Plomberie',
      building: 'Résidence Les Roses',
      status: 'EN_COURS',
      date: new Date()
    },
    {
      type: 'Électricité',
      building: 'Résidence Les Lilas',
      status: 'EN_ATTENTE',
      date: new Date()
    }
  ];

  // Injection des services
  private readonly immeubleService = inject(ImmeubleService);
  private readonly paiementService = inject(PaiementService);
  private readonly proprietaireService = inject(ProprietaireService);
  private readonly store = inject(Store<{ auth: AuthState }>);
  private readonly authService = inject(AuthService);
  private readonly incidentService = inject(IncidentService);
  private readonly locataireService = inject(LocataireService);
  private readonly appartementService = inject(AppartementService);
  private readonly messageService = inject(MessageService);

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
      amountDue: 0,
      incidents: 0
    };
  }

  ngOnInit(): void {
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
        this.dashboardStats = stats;
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
    const defaultStats: DashboardStats = {
      ...this.dashboardStats,
      totalBuildings: 0,
      monthlyPayments: 0,
      ownersCount: 0,
      pendingPayments: 0,
      totalPaid: 0,
      activeBuildings: 0,
      buildingsInMaintenance: 0
    };

    return forkJoin({
      immeubles: this.immeubleService.getAllImmeubles().pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des immeubles:', error);
          this.errorMessage = 'Impossible de charger les immeubles. Veuillez vérifier vos autorisations.';
          return of([]);
        })
      ),
      paiements: this.paiementService.getAllPaiements().pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des paiements:', error);
          this.errorMessage = 'Impossible de charger les paiements. Veuillez vérifier vos autorisations.';
          return of([]);
        })
      ),
      proprietaires: this.proprietaireService.getAllProprietaires().pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des propriétaires:', error);
          this.errorMessage = 'Impossible de charger les propriétaires. Veuillez vérifier vos autorisations.';
          return of([]);
        })
      )
    }).pipe(
      map(data => {
        const paiements = Array.isArray(data.paiements) ? data.paiements : [];
        const immeubles = Array.isArray(data.immeubles) ? data.immeubles : [];
        const proprietaires = Array.isArray(data.proprietaires) ? data.proprietaires : [];

        return {
          ...defaultStats,
          totalBuildings: immeubles.length,
          monthlyPayments: paiements.filter(p => {
            if (!p?.datePaiement) return false;
            const paiementDate = new Date(p.datePaiement);
            const currentDate = new Date();
            return paiementDate.getMonth() === currentDate.getMonth() &&
                   paiementDate.getFullYear() === currentDate.getFullYear();
          }).length,
          ownersCount: proprietaires.length,
          pendingPayments: paiements.filter(p => p?.status === 'EN_ATTENTE').length,
          totalPaid: paiements.reduce((acc, p) => acc + (p?.montant || 0), 0),
          activeBuildings: immeubles.filter(i => i?.status === 'ACTIF').length,
          buildingsInMaintenance: immeubles.filter(i => i?.status === 'EN_TRAVAUX').length
        };
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des statistiques admin:', error);
        this.hasError = true;
        this.errorMessage = 'Une erreur est survenue lors du chargement des statistiques. Veuillez réessayer plus tard.';
        return of(defaultStats);
      })
    );
  }

  private loadSyndicStats(): Observable<DashboardStats> {
    const userId = this.authService.currentUserValue?.userId ?? 0;
    const defaultStats: DashboardStats = {
      ...this.dashboardStats,
      buildingsCount: 0,
      pendingPayments: 0,
      apartmentsCount: 0
    };

    return forkJoin({
      immeubles: this.immeubleService.getImmeublesBySyndic(userId).pipe(
        catchError(() => of([]))
      ),
      paiementsRecents: this.paiementService.getPaiementsBySyndic(userId).pipe(
        catchError(() => of([]))
      )
    }).pipe(
      map(data => {
        const immeubles = Array.isArray(data.immeubles) ? data.immeubles : [];
        const paiements = Array.isArray(data.paiementsRecents) ? data.paiementsRecents : [];

        return {
          ...defaultStats,
          buildingsCount: immeubles.length,
          pendingPayments: paiements.filter(p => p?.status === 'EN_ATTENTE').length,
          apartmentsCount: immeubles.reduce((acc, imm) => acc + (imm?.nombreAppartements || 0), 0)
        };
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des statistiques syndic:', error);
        return of(defaultStats);
      })
    );
  }

  private loadProprietaireStats(): Observable<DashboardStats> {
    const userId = this.authService.currentUserValue?.userId;
    if (!userId) {
      return of(this.dashboardStats);
    }

    const defaultStats: DashboardStats = {
      ...this.dashboardStats,
      pendingPayments: 0,
      apartmentsCount: 0,
      incidents: 0
    };
    
    return forkJoin({
      paiements: this.paiementService.getPaiementsByProprietaire(userId).pipe(
        catchError(() => of([]))
      ),
      appartements: this.appartementService.getAppartementsProprietaire(userId).pipe(
        catchError(() => of([]))
      ),
      incidents: this.incidentService.getIncidentsByProprietaire(userId).pipe(
        catchError(() => of([]))
      )
    }).pipe(
      map(data => {
        const paiements = Array.isArray(data.paiements) ? data.paiements : [];
        const appartements = Array.isArray(data.appartements) ? data.appartements : [];
        const incidents = Array.isArray(data.incidents) ? data.incidents : [];

        return {
          ...defaultStats,
          pendingPayments: paiements.filter(p => p?.status === 'EN_ATTENTE').length,
          apartmentsCount: appartements.length,
          incidents: incidents.filter(i => i?.statut !== 'RESOLU').length
        };
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des statistiques propriétaire:', error);
        return of(defaultStats);
      })
    );
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

  loadProprietaireData(): void {
    const userId = this.authService.currentUserValue?.userId;
    if (!userId) return;

    // ... code existant ...

    // Chargement des incidents du propriétaire
    if (userId !== undefined) {
      this.incidentService.getIncidentsByProprietaire(userId).subscribe({
        next: (incidents: any) => {
          this.dashboardStats.incidents = incidents.filter((incident: any) => 
            incident.statut !== 'RESOLU' && incident.statut !== 'ANNULE'
          ).length;
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement des incidents:', error);
        }
      });
    }
  }

  loadRecentMessages(): void {
    // Implementation of loadRecentMessages method
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'EN_COURS':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800';
      case 'EN_ATTENTE':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800';
      case 'RESOLU':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800';
      default:
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
    }
  }
}
