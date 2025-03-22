import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from '../authentication/models/auth.model';
import {environment} from '@env/environment';
import {Store} from '@ngrx/store';
import * as AuthActions from '../authentication/store/actions/auth.actions';
import {Router} from '@angular/router';
import {NavItem} from '../models/nav-item.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'currentUser';
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public currentUserValue = this.currentUserSubject.value;
  public isAuthenticated$ = this.currentUser$.pipe(
    map(user => !!user && !!this.getToken())
  );

  private readonly navItems: NavItem[] = [
    {
      label: 'Tableau de bord',
      route: '/dashboard',
      icon: 'fas fa-chart-line',
      roles: ['ADMIN', 'SYNDIC', 'PROPRIETAIRE']
    },
    {
      label: 'Immeubles',
      route: '/immeubles',
      icon: 'fas fa-building',
      roles: ['ADMIN', 'SYNDIC']
    },
    {
      label: 'Appartements',
      route: '/appartements',
      icon: 'fas fa-home',
      roles: ['ADMIN', 'SYNDIC', 'PROPRIETAIRE']
    },
    {
      label: 'Paiements',
      route: '/paiements',
      icon: 'fas fa-money-bill',
      roles: ['ADMIN', 'SYNDIC', 'PROPRIETAIRE']
    },
    {
      label: 'Incidents',
      route: '/incidents',
      icon: 'fas fa-exclamation-triangle',
      roles: ['ADMIN', 'SYNDIC', 'PROPRIETAIRE']
    },
    {
      label: 'Documents',
      route: '/documents',
      icon: 'fas fa-file-alt',
      roles: ['ADMIN', 'SYNDIC', 'PROPRIETAIRE']
    },
    {
      label: 'Syndics',
      route: '/syndics',
      icon: 'fas fa-user-tie',
      roles: ['ADMIN']
    },
    {
      label: 'Rapports',
      route: '/rapports',
      icon: 'fas fa-file-pdf',
      roles: ['ADMIN']
    }
  ];

  constructor(
    private http: HttpClient,
    private store: Store,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    const token = localStorage.getItem(this.TOKEN_KEY);

    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.store.dispatch(AuthActions.initializeAuthStateSuccess({user}));
        this.redirectBasedOnRole(user.role);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.clearStorage();
      }
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/authenticate`, request)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
          this.redirectBasedOnRole(response.role);
        }),
        catchError(error => this.handleError(error))
      );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(() => {
          this.router.navigate(['/auth/login']);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  private handleAuthSuccess(response: LoginResponse): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(response));
    localStorage.setItem(this.TOKEN_KEY, response.token);
    this.currentUserSubject.next(response);
  }

  private redirectBasedOnRole(role: string): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): Observable<void> {
    const token = this.getToken();
    if (!token) {
      this.clearStorage();
      this.router.navigate(['/auth/login']);
      return of(void 0);
    }

    return this.http.post<void>(`${this.API_URL}/logout`, {})
      .pipe(
        tap(() => {
          this.clearStorage();
          this.router.navigate(['/auth/login']);
        }),
        catchError(error => {
          console.error('Logout error:', error);
          this.clearStorage();
          this.router.navigate(['/auth/login']);
          return throwError(() => error);
        })
      );
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(role: string): boolean {
    const currentUser = this.getCurrentUser();
    return Boolean(currentUser && currentUser.role === role);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }

  getAuthorizedNavItems(): Observable<NavItem[]> {
    return new Observable(subscriber => {
      this.currentUser$.subscribe(user => {
        if (!user) {
          subscriber.next([]);
          return;
        }
        const authorizedItems = this.navItems.filter(item =>
          item.roles.includes(user.role)
        );
        subscriber.next(authorizedItems);
      });
    });
  }
}
