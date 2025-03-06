import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/auth.model';
import { LoginRequest, LoginResponse } from '../models/login.model';
import { RegisterRequest, RegisterResponse } from '../models/register.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Validate token expiration if needed
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/authenticate`, credentials)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  register(credentials: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, credentials)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private handleAuthResponse(response: LoginResponse | RegisterResponse): void {
    if (response.token) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      const user: User = {
        userId: response.userId,
        email: response.email,
        nom: response.nom,
        prenom: response.prenom,
        role: response.role,
        token: response.token,
        isActive: 'isActive' in response ? response.isActive : true
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }
}
