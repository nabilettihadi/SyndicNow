import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {LoginCredentials, RegisterCredentials, User} from '../models/auth.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Validate token expiration if needed
    }
  }

  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/authenticate`, credentials).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  register(credentials: RegisterCredentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, credentials).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    // Additional cleanup if needed
  }

  private handleAuthResponse(response: any): void {
    if (response.token) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      const user: User = {
        email: response.email,
        role: response.role,
        token: response.token
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
