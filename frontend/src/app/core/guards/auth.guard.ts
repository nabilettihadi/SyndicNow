import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Store} from '@ngrx/store';
import {map, Observable, take, tap} from 'rxjs';
import {AuthState} from '../authentication/models/auth.model';
import {AuthService} from '../services/auth.service';
import { CanActivate } from '@angular/router';
import { inject } from '@angular/core';
import { UserRole } from '@core/models/user.model';

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

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Rediriger en fonction du rôle
    const role = currentUser.role;
    if (role === UserRole.ADMIN) {
      return this.router.createUrlTree(['/admin']);
    } else if (role === UserRole.SYNDIC) {
      return this.router.createUrlTree(['/syndic']);
    } else if (role === UserRole.PROPRIETAIRE) {
      return this.router.createUrlTree(['/proprietaire']);
    } else {
      return this.router.createUrlTree(['/']);
    }
  }
}

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      router.navigate(['/auth/login']);
      return false;
    })
  );
};
