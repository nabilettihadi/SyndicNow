import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Store} from '@ngrx/store';
import {map, Observable, take, tap} from 'rxjs';
import {AuthState} from '../authentication/models/auth.model';
import {AuthService} from '../services/auth.service';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<{ auth: AuthState }>,
    private authService: AuthService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  private getFullPath(route: ActivatedRouteSnapshot): string {
    const paths: string[] = [];
    let current: ActivatedRouteSnapshot | null = route;

    while (current) {
      if (current.routeConfig?.path) {
        paths.unshift(current.routeConfig.path);
      }
      current = current.parent;
    }

    return paths.join('/');
  }

  private isRoleSpecificRoute(path: string, userRole: string): boolean {
    // Routes spécifiques au SYNDIC
    if (userRole !== 'SYNDIC' && (
      path.includes('immeubles') ||
      path.includes('appartements') ||
      path.includes('charges')
    )) {
      return true;
    }

    // Routes spécifiques au PROPRIETAIRE
    return userRole !== 'PROPRIETAIRE' && (
      path.includes('mes-appartements') ||
      path.includes('mes-paiements')
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<{ auth: AuthState }>
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const requiredRole = route.data['role'];
    if (!requiredRole) {
      return true;
    }

    return this.store.select('auth').pipe(
      map(state => {
        if (state.user?.role === requiredRole) {
          return true;
        }
        this.router.navigate(['/dashboard']);
        return false;
      })
    );
  }
}
