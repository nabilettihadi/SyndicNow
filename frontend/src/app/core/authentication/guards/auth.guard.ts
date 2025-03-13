import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { selectIsAuthenticated } from '../store/auth.selectors';
import { AuthState } from '../models/auth.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const isAuthRoute = state.url.startsWith('/auth');

    return this.store.select(selectIsAuthenticated).pipe(
      tap(isAuthenticated => {
        console.log('AuthGuard - État authentification:', isAuthenticated);
        console.log('Route tentée:', state.url);
      }),
      map(isAuthenticated => {
        if (isAuthRoute) {
          if (isAuthenticated) {
            this.router.navigate(['/dashboard']);
            return false;
          }
          return true;
        } else {
          if (!isAuthenticated) {
            this.router.navigate(['/auth/login']);
            return false;
          }
          return true;
        }
      })
    );
  }
} 