import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { AuthState, LoginResponse, UserRole } from '../../../core/authentication/models/auth.model';
import * as AuthActions from '../../../core/authentication/store/actions/auth.actions';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<LoginResponse | null>;
  userName$: Observable<string>;
  userRole$: Observable<UserRole | null>;
  private subscription = new Subscription();
  isUserMenuOpen = false;
  isMobileMenuOpen = false;

  constructor(
    private router: Router,
    private store: Store<{ auth: AuthState }>,
    private authService: AuthService
  ) {
    this.isAuthenticated$ = this.store.select(state => !!state.auth.user);
    this.currentUser$ = this.store.select(state => state.auth.user);
    this.userName$ = this.currentUser$.pipe(
      map(user => user ? `${user.prenom} ${user.nom}` : '')
    );
    this.userRole$ = this.currentUser$.pipe(
      map(user => user ? user.role : null)
    );
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 768 && this.isMobileMenuOpen) {
      this.toggleMobileMenu(false);
    }
  }

  ngOnInit(): void {
    // Vérifier l'état d'authentification au démarrage
    this.subscription.add(
      this.store.select(state => !!state.auth.user).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);
  }

  hasRole(role: UserRole): Observable<boolean> {
    return this.userRole$.pipe(
      map(userRole => userRole === role)
    );
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleMobileMenu(force?: boolean): void {
    this.isMobileMenuOpen = force !== undefined ? force : !this.isMobileMenuOpen;
  }
}
