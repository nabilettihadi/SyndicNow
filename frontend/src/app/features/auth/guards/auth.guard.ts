import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { AuthState } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(state => state.auth.user).pipe(
      take(1),
      map(user => {
        if (user) {
          // Si l'utilisateur est authentifié, rediriger vers le dashboard
          this.router.navigate(['/dashboard']);
          return false;
        }
        // Si l'utilisateur n'est pas authentifié, autoriser l'accès à la page
        return true;
      })
    );
  }
} 