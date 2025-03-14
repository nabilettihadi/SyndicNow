import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { AuthState, LoginResponse, UserRole } from '../../core/authentication/models/auth.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  userName$: Observable<string>;
  userRole$: Observable<UserRole>;
  dashboardStats: any;

  constructor(
    private store: Store<{ auth: AuthState }>,
    private dashboardService: DashboardService
  ) {
    this.userName$ = this.store.select('auth').pipe(
      map(state => state.user?.prenom + ' ' + state.user?.nom)
    );
    this.userRole$ = this.store.select('auth').pipe(
      map(state => state.user?.role || 'PROPRIETAIRE')
    );
  }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  private loadDashboardStats(): void {
    this.userRole$.subscribe(role => {
      if (!role) return;

      let statsObservable: Observable<any>;
      
      switch (role) {
        case 'ADMIN':
          statsObservable = this.dashboardService.getAdminStats();
          break;
        case 'SYNDIC':
          statsObservable = this.dashboardService.getSyndicStats();
          break;
        case 'PROPRIETAIRE':
          statsObservable = this.dashboardService.getProprietaireStats();
          break;
        default:
          return;
      }

      statsObservable.subscribe({
        next: (stats) => {
          this.dashboardStats = stats;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des statistiques:', error);
          this.isLoading = false;
        }
      });
    });
  }

  hasRole(role: UserRole): Observable<boolean> {
    return this.userRole$.pipe(
      map(userRole => userRole === role)
    );
  }
}
