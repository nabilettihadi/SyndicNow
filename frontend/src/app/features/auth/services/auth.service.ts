import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = `${environment.apiUrl}/auth`;
    private currentUserSubject = new BehaviorSubject<LoginResponse | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        // Charger l'utilisateur depuis le localStorage au démarrage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUserSubject.next(JSON.parse(storedUser));
        }
    }

    login(request: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.API_URL}/authenticate`, request)
            .pipe(
                tap(response => {
                    // Stocker l'utilisateur et le token
                    localStorage.setItem('currentUser', JSON.stringify(response));
                    localStorage.setItem('token', response.token);
                    this.currentUserSubject.next(response);
                })
            );
    }

    register(request: RegisterRequest): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.API_URL}/register`, request)
            .pipe(
                tap(response => {
                    // Stocker l'utilisateur et le token après l'inscription
                    const loginResponse: LoginResponse = {
                        userId: response.userId,
                        email: response.email,
                        nom: response.nom,
                        prenom: response.prenom,
                        role: response.role,
                        token: response.token,
                        isActive: true
                    };
                    localStorage.setItem('currentUser', JSON.stringify(loginResponse));
                    localStorage.setItem('token', response.token);
                    this.currentUserSubject.next(loginResponse);
                })
            );
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/logout`, {})
            .pipe(
                tap(() => {
                    // Nettoyer le stockage local
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('token');
                    this.currentUserSubject.next(null);
                })
            );
    }

    getCurrentUser(): LoginResponse | null {
        return this.currentUserSubject.value;
    }

    isLoggedIn(): boolean {
        return !!this.getCurrentUser();
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        return user ? user.role === role : false;
    }
}
