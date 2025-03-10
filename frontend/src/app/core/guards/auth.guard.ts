import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const currentUser = this.authService.getCurrentUser();
        
        if (!currentUser) {
            // Non authentifié, rediriger vers la page de connexion
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
            return false;
        }

        // Vérifier si la route nécessite des rôles spécifiques
        if (route.data['roles'] && !route.data['roles'].includes(currentUser.role)) {
            // Rôle non autorisé, rediriger vers la page d'accueil
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }
}
