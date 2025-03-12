import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthState, User, LoginResponse } from '../../../features/auth/models/auth.model';
import * as AuthActions from '../../../features/auth/store/actions/auth.actions';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        height: '*',
        opacity: 1
      })),
      state('out', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('in => out', [
        animate('200ms ease-out')
      ]),
      transition('out => in', [
        animate('200ms ease-in')
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated$: Observable<boolean>;
  userRole$: Observable<string | null>;
  userName$: Observable<string | null>;
  private subscription = new Subscription();
  isMobileMenuOpen = false;

  constructor(
    private store: Store<{ auth: AuthState }>,
    private authService: AuthService
  ) {
    this.isAuthenticated$ = this.store.select(state => !!state.auth.user);
    this.userRole$ = this.store.select(state => state.auth.user?.role || null);
    this.userName$ = this.store.select(state => 
      state.auth.user ? `${state.auth.user.prenom} ${state.auth.user.nom}` : null
    );
  }

  ngOnInit(): void {
    const storedUser = this.authService.getStoredUser();
    if (storedUser && !this.authService.currentUser && 
        storedUser.userId && storedUser.token && 
        storedUser.role && storedUser.nom && storedUser.prenom) {

      const loginResponse: LoginResponse = {
        userId: storedUser.userId,
        email: storedUser.email,
        token: storedUser.token,
        role: storedUser.role,
        nom: storedUser.nom,
        prenom: storedUser.prenom,
        isActive: storedUser.isActive ?? false
      };
      this.store.dispatch(AuthActions.loginSuccess({ user: loginResponse }));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLogout(event: Event): void {
    event.preventDefault();
    this.store.dispatch(AuthActions.logout());
    this.toggleMobileMenu(false);
  }

  toggleMobileMenu(forceState?: boolean): void {
    this.isMobileMenuOpen = forceState !== undefined ? forceState : !this.isMobileMenuOpen;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.toggleMobileMenu(false);
    }
  }
}
