import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { AuthState } from '../../features/auth/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class RequireAuthGuard {
  constructor(
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(state => state.auth.user).pipe(
      take(1),
      map(user => {
        if (!user) {
          // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
          this.router.navigate(['/auth/login']);
          return false;
        }

        // Vérifier si la route a des restrictions de rôle
        const currentUrl = this.router.url;
        if (currentUrl.startsWith('/admin') && user.role !== 'ADMIN') {
          this.router.navigate(['/dashboard']);
          return false;
        }
        if (currentUrl.startsWith('/syndic') && user.role !== 'SYNDIC') {
          this.router.navigate(['/dashboard']);
          return false;
        }
        if (currentUrl.startsWith('/proprietaire') && user.role !== 'PROPRIETAIRE') {
          this.router.navigate(['/dashboard']);
          return false;
        }

        // Si l'utilisateur est authentifié et a les bonnes permissions, autoriser l'accès
        return true;
      })
    );
  }
} 