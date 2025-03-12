import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
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
      map(user => {
        const currentPath = this.getFullPath(route);

        // Pages publiques (home)
        if (currentPath === '' || currentPath === 'home') {
          return true;
        }

        // Pages d'authentification (login, register)
        if (currentPath.startsWith('auth')) {
          if (user) {
            // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
            return this.router.createUrlTree(['/dashboard']);
          }
          return true; // Autoriser l'accès aux pages d'auth si non connecté
        }

        // Pour toutes les autres routes, vérifier l'authentification
        if (!user) {
          // Sauvegarder l'URL tentée pour redirection après connexion
          return this.router.createUrlTree(['/auth/login']);
        }

        // Vérifier les permissions de rôle pour les sections protégées
        const requiredRole = route.data['role'];
        if (requiredRole && user.role !== requiredRole) {
          // Si l'utilisateur n'a pas le bon rôle, rediriger vers le dashboard
          return this.router.createUrlTree(['/dashboard']);
        }

        // Route nécessitant uniquement l'authentification (ex: dashboard)
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
}
