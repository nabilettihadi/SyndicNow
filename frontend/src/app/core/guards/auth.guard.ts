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

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      try {
        await this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
      } catch (error) {
        console.error('Navigation failed:', error);
      }
      return false;
    }

    if (route.data['roles'] && !route.data['roles'].includes(currentUser.role)) {
      try {
        await this.router.navigate(['/']);
      } catch (error) {
        console.error('Navigation failed:', error);
      }
      return false;
    }

    return true;
  }
}
