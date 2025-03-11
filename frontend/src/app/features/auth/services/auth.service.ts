import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = `${environment.apiUrl}/auth`;
    private readonly TOKEN_KEY = 'token';
    private readonly USER_KEY = 'currentUser';
    private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadStoredUser();
    }

    private loadStoredUser(): void {
        const storedUser = localStorage.getItem(this.USER_KEY);
        const token = localStorage.getItem(this.TOKEN_KEY);
        
        if (storedUser && token) {
            try {
                const user = JSON.parse(storedUser);
                this.currentUserSubject.next(user);
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

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'Une erreur est survenue';
        
        if (error.error instanceof ErrorEvent) {
            // Erreur côté client
            errorMessage = error.error.message;
        } else {
            // Erreur côté serveur
            if (error.status === 401) {
                errorMessage = 'Email ou mot de passe incorrect';
            } else if (error.error?.message) {
                errorMessage = error.error.message;
            }
        }
        
        return throwError(() => errorMessage);
    }

    login(request: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.API_URL}/authenticate`, request)
            .pipe(
                tap(response => this.handleAuthSuccess(response)),
                catchError(error => this.handleError(error))
            );
    }

    register(request: RegisterRequest): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.API_URL}/register`, request)
            .pipe(
                tap(response => this.handleAuthSuccess({
                    userId: response.userId,
                    email: response.email,
                    nom: response.nom,
                    prenom: response.prenom,
                    role: response.role,
                    token: response.token,
                    isActive: true
                })),
                catchError(error => this.handleError(error))
            );
    }

    private handleAuthSuccess(response: LoginResponse): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(response));
        localStorage.setItem(this.TOKEN_KEY, response.token);
        this.currentUserSubject.next(response);
    }

    logout(): Observable<void> {
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
}
