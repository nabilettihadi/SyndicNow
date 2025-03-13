import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthState, LoginResponse, UserRole } from '../../../features/auth/models/auth.model';
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
  userName$: Observable<string | undefined>;
  userRole$: Observable<UserRole | undefined>;
  private subscription = new Subscription();
  isMobileMenuOpen = false;

  constructor(
    private store: Store<{ auth: AuthState }>,
    private authService: AuthService
  ) {
    this.isAuthenticated$ = this.store.select(state => !!state.auth.user);
    this.userName$ = this.store.select(state => 
      state.auth.user ? `${state.auth.user.prenom} ${state.auth.user.nom}` : undefined
    );
    this.userRole$ = this.store.select(state => 
      state.auth.user ? state.auth.user.role : undefined
    );
  }

  ngOnInit(): void {
    this.subscription.add(
      this.store.select(state => state.auth.user).subscribe(storeUser => {
        const storedUser = this.authService.currentUserValue;
        if (storedUser && !storeUser) {
          this.store.dispatch(AuthActions.loginSuccess({ user: storedUser }));
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLogout(event: Event): void {
    event.preventDefault();
    this.store.dispatch(AuthActions.logout());
    this.authService.setCurrentUser(null);
    this.toggleMobileMenu(false);
  }

  toggleMobileMenu(force?: boolean): void {
    this.isMobileMenuOpen = force !== undefined ? force : !this.isMobileMenuOpen;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.toggleMobileMenu(false);
    }
  }
}
