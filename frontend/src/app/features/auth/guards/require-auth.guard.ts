import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, tap, take } from 'rxjs';
import { selectIsAuthenticated } from '../store/selectors/auth.selectors';
import { AuthState } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class RequireAuthGuard implements CanActivate {
  constructor(
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.select(selectIsAuthenticated).pipe(
      take(1),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          console.log('Utilisateur non authentifié, redirection vers login');
          this.router.navigate(['/auth/login']);
        } else {
          console.log('Accès autorisé à la route protégée');
        }
      }),
      map(isAuthenticated => isAuthenticated)
    );
  }
} 