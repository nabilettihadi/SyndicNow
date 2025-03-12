import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthState, User } from '../../features/auth/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';
  private currentUserSubject: BehaviorSubject<User | null>;

  constructor(private store: Store<{ auth: AuthState }>) {
    // Initialiser avec les données du localStorage
    const storedUser = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);

    // S'abonner aux changements du store pour maintenir le localStorage à jour
    this.store.select(state => state.auth.user).subscribe(user => {
      if (user) {
        this.setStoredUser(user);
      } else {
        this.clearStoredUser();
      }
      this.currentUserSubject.next(user);
    });
  }

  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  public get isAuthenticated(): boolean {
    return !!this.getStoredToken() && !!this.getStoredUser();
  }

  public get isAuthenticated$(): Observable<boolean> {
    return this.store.select(state => !!state.auth.user);
  }

  public getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public setStoredToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  public setStoredUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  public clearStoredUser(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }
} 