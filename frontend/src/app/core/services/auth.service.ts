import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LoginResponse, LoginRequest} from '@features/auth/models/auth.model';
import {environment} from '@env/environment';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<LoginResponse | null>;
  public currentUser: Observable<LoginResponse | null>;
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<LoginResponse | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
    
    if (storedUser) {
      console.log('=== Current User Debug ===');
      console.log('User from localStorage:', JSON.parse(storedUser));
    }
  }

  public get currentUserValue(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  public setCurrentUser(user: LoginResponse | null): void {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(user);
  }

  private getUserFromLocalStorage(): LoginResponse | null {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('currentUser');
      return null;
    }
  }

  public isAuthenticated(): boolean {
    const currentUser = this.currentUserValue;
    return !!currentUser && !!currentUser.token;
  }

  getCurrentUser(): LoginResponse | null {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      console.log('Aucun utilisateur trouvé dans le localStorage');
      return null;
    }
    try {
      const user = JSON.parse(userStr);
      console.log('=== Current User Debug ===');
      console.log('User from localStorage:', user);
      return user;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  getCurrentUserId(): number | null {
    const currentUser = this.currentUserValue;
    return currentUser ? currentUser.userId : null;
  }

  getToken(): string | null {
    const currentUser = this.currentUserValue;
    if (currentUser && currentUser.token) {
      console.log('Token récupéré:', currentUser.token);
      return currentUser.token;
    }
    console.log('Aucun token trouvé');
    return null;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('currentUser', JSON.stringify(response));
            this.currentUserSubject.next(response);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  hasRole(role: string): boolean {
    const currentUser = this.currentUserValue;
    return Boolean(currentUser && currentUser.role === role);
  }
}
