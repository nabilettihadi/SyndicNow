import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take, tap } from 'rxjs';
import { AuthState } from '../../features/auth/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router,
    private store: Store<{ auth: AuthState }>
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.store.select(state => state.auth.user).pipe(
      take(1),
      tap(user => {
        console.log('AuthGuard - État utilisateur:', user);
        console.log('Route tentée:', state.url);
      }),
      map(user => {
        const currentPath = this.getFullPath(route);
        console.log('Chemin complet:', currentPath);

        // Gestion des routes d'authentification (login/register)
        if (currentPath.startsWith('auth')) {
          if (user) {
            console.log('Utilisateur déjà connecté, redirection vers dashboard');
            return this.router.createUrlTree(['/dashboard']);
          }
          console.log('Accès autorisé aux pages d\'authentification');
          return true;
        }

        // Gestion des routes protégées
        if (!user) {
          console.log('Utilisateur non connecté, redirection vers login');
          return this.router.createUrlTree(['/auth/login'], {
            queryParams: { returnUrl: state.url }
          });
        }

        // Vérification des permissions basées sur le rôle
        const requiredRole = route.data['role'];
        if (requiredRole && user.role !== requiredRole) {
          console.log('Rôle insuffisant, redirection vers dashboard');
          return this.router.createUrlTree(['/dashboard']);
        }

        // Vérification des routes spécifiques au rôle
        if (this.isRoleSpecificRoute(currentPath, user.role)) {
          console.log('Route non autorisée pour ce rôle, redirection vers dashboard');
          return this.router.createUrlTree(['/dashboard']);
        }

        console.log('Accès autorisé à la route');
        return true;
      })
    );
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
      path.includes('buildings') ||
      path.includes('syndic/payments')
    )) {
      return true;
    }

    // Routes spécifiques au PROPRIETAIRE
    if (userRole !== 'PROPRIETAIRE' && (
      path.includes('my-properties') ||
      path.includes('payments')
    )) {
      return true;
    }

    return false;
  }
}
