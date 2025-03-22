import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Store} from '@ngrx/store';
import {map, Observable, take} from 'rxjs';
import {AuthState} from '../authentication/models/auth.model';
import {AuthService} from '../services/auth.service';
import {UserRole} from '@core/models/user.model';

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
    // Vérifier l'authentification
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], {
        queryParams: {returnUrl: state.url}
      });
      return false;
    }

    // Vérifier les rôles requis pour cette route
    const requiredRoles = route.data['roles'] as Array<string>;
    const currentUser = this.authService.getCurrentUser();

    if (requiredRoles && currentUser) {
      // Si la route nécessite un rôle spécifique
      if (!requiredRoles.includes(currentUser.role)) {
        console.log(`Accès refusé: rôle ${currentUser.role} non autorisé pour cette route`);

        // Rediriger vers la page appropriée selon le rôle de l'utilisateur
        this.redirectBasedOnRole(currentUser.role);
        return false;
      }
    }

    // Vérifier les routes spécifiques aux rôles
    if (currentUser && this.isRoleSpecificRoute(this.getFullPath(route), currentUser.role)) {
      console.log(`Route spécifique non autorisée pour le rôle ${currentUser.role}`);
      this.redirectBasedOnRole(currentUser.role);
      return false;
    }

    return true;
  }

  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case UserRole.ADMIN:
        this.router.navigate(['/admin']);
        break;
      case UserRole.SYNDIC:
        this.router.navigate(['/syndic/dashboard']);
        break;
      case UserRole.PROPRIETAIRE:
        this.router.navigate(['/proprietaire/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
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
    // Routes spécifiques à l'ADMIN
    if (userRole !== UserRole.ADMIN && (
      path.includes('admin') ||
      path.includes('syndics')
    )) {
      return true;
    }

    // Routes spécifiques au SYNDIC
    if (userRole !== UserRole.SYNDIC && userRole !== UserRole.ADMIN && (
      path.includes('immeubles') ||
      path.includes('appartements') ||
      path.includes('charges')
    )) {
      return true;
    }

    // Routes spécifiques au PROPRIETAIRE
    return userRole !== UserRole.PROPRIETAIRE && (
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

export const roleGuard = (allowedRoles: UserRole[]) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      // Vérifier si l'utilisateur est authentifié
      if (!user) {
        router.navigate(['/auth/login']);
        return false;
      }

      // Vérifier si l'utilisateur a un rôle autorisé
      if (allowedRoles.includes(user.role as UserRole)) {
        return true;
      }

      // Redirection basée sur le rôle actuel
      switch (user.role) {
        case UserRole.ADMIN:
          router.navigate(['/admin']);
          break;
        case UserRole.SYNDIC:
          router.navigate(['/syndic/dashboard']);
          break;
        case UserRole.PROPRIETAIRE:
          router.navigate(['/proprietaire/dashboard']);
          break;
        default:
          router.navigate(['/']);
      }

      return false;
    })
  );
};
