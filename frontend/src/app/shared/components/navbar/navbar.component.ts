import { Component, OnInit, OnDestroy, HostListener, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
  isScrolled = false;
  private scrollThreshold = 50;
  private lastScrollPosition = 0;
  private isNavbarVisible = true;

  constructor(
    private router: Router,
    private store: Store<{ auth: AuthState }>,
    private authService: AuthService,
    private renderer: Renderer2,
    private el: ElementRef
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

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const currentScroll = window.scrollY;
    
    // Gestion de la classe scrolled
    if (currentScroll > this.scrollThreshold) {
      this.renderer.addClass(this.el.nativeElement.querySelector('.navbar'), 'scrolled');
    } else {
      this.renderer.removeClass(this.el.nativeElement.querySelector('.navbar'), 'scrolled');
    }

    // Gestion de la visibilité de la navbar lors du scroll
    if (currentScroll > this.lastScrollPosition && currentScroll > this.scrollThreshold) {
      if (this.isNavbarVisible && !this.isMobileMenuOpen) {
        this.renderer.setStyle(this.el.nativeElement.querySelector('.navbar'), 'transform', 'translateY(-100%)');
        this.isNavbarVisible = false;
      }
    } else {
      if (!this.isNavbarVisible) {
        this.renderer.setStyle(this.el.nativeElement.querySelector('.navbar'), 'transform', 'translateY(0)');
        this.isNavbarVisible = true;
      }
    }

    this.lastScrollPosition = currentScroll;
  }

  @HostListener('window:click', ['$event'])
  onClick(event: Event): void {
    const userMenu = document.querySelector('.user-menu');
    const userButton = document.querySelector('.user-avatar');
    
    if (userMenu && userButton && this.isUserMenuOpen) {
      if (!userMenu.contains(event.target as Node) && !userButton.contains(event.target as Node)) {
        this.closeUserMenu();
      }
    }
  }

  ngOnInit(): void {
    // Vérifier l'état d'authentification au démarrage
    this.subscription.add(
      this.store.select(state => !!state.auth.user).subscribe()
    );

    // Gérer le scroll avec debounce
    this.subscription.add(
      fromEvent(window, 'scroll')
        .pipe(
          debounceTime(10),
          distinctUntilChanged()
        )
        .subscribe(() => {
          this.isScrolled = window.scrollY > 0;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);
    this.closeUserMenu();
    this.closeMobileMenu();
  }

  hasRole(role: UserRole): Observable<boolean> {
    return this.userRole$.pipe(
      map(userRole => userRole === role)
    );
  }

  toggleUserMenu(): void {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  toggleMobileMenu(force?: boolean): void {
    if (this.isUserMenuOpen) {
      this.closeUserMenu();
    }
    this.isMobileMenuOpen = force !== undefined ? force : !this.isMobileMenuOpen;
    
    // Empêcher le défilement du body quand le menu mobile est ouvert
    if (this.isMobileMenuOpen) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
      // Réafficher la navbar si elle était cachée
      this.renderer.setStyle(this.el.nativeElement.querySelector('.navbar'), 'transform', 'translateY(0)');
      this.isNavbarVisible = true;
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  closeMobileMenu(): void {
    this.toggleMobileMenu(false);
  }

  // Amélioration de la gestion des clics extérieurs
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const navbar = this.el.nativeElement;
    const userMenu = navbar.querySelector('.user-menu');
    const mobileMenu = navbar.querySelector('.mobile-menu');
    
    if (!navbar.contains(event.target as Node)) {
      this.closeUserMenu();
      if (this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    } else if (userMenu && !userMenu.contains(event.target as Node)) {
      this.closeUserMenu();
    }
  }

  // Gestion des raccourcis clavier
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeUserMenu();
      if (this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    }
  }
}
