import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from '../models/auth.model';
import {environment} from '@env/environment';
import {Store} from '@ngrx/store';
import * as AuthActions from '../store/actions/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'currentUser';
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private store: Store
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
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => this.handleError(error))
      );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => {
          if (response.token) {
            const userWithActive = {...response, isActive: true};
            localStorage.setItem(this.TOKEN_KEY, response.token);
            localStorage.setItem(this.USER_KEY, JSON.stringify(userWithActive));
            this.currentUserSubject.next(userWithActive);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  private handleAuthSuccess(response: LoginResponse): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(response));
    localStorage.setItem(this.TOKEN_KEY, response.token);
    this.currentUserSubject.next(response);
  }

  logout(): Observable<void> {
    const token = this.getToken();
    if (!token) {
      // Si pas de token, on nettoie juste le stockage local
      this.clearStorage();
      return of(void 0);
    }

    return this.http.post<void>(`${this.API_URL}/logout`, {})
      .pipe(
        tap(() => this.clearStorage()),
        catchError(error => {
          console.error('Logout error:', error);
          // On nettoie quand même le stockage en cas d'erreur
          this.clearStorage();
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

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
