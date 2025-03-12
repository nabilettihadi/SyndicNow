import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '@features/auth/services/auth.service';
import {Router} from '@angular/router';
import {environment} from '@env/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Ne pas ajouter le token pour les requêtes d'authentification
    if (this.isAuthRequest(request)) {
      return next.handle(request);
    }

    const token = this.authService.getToken();
    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Si on reçoit une erreur 401, on déconnecte l'utilisateur
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private isAuthRequest(request: HttpRequest<any>): boolean {
    const authUrls = [
      `${environment.apiUrl}/auth/authenticate`,
      `${environment.apiUrl}/auth/register`,
      `${environment.apiUrl}/auth/refresh-token`
    ];
    return authUrls.some(url => request.url.includes(url));
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      // Déconnexion et redirection vers la page de connexion
      this.authService.logout().subscribe({
        next: () => {
          this.router.navigate(['/auth/login'], {
            queryParams: {returnUrl: this.router.url}
          });
        },
        error: (error) => {
          console.error('Logout error:', error);
          // Même en cas d'erreur, on redirige vers la page de connexion
          this.router.navigate(['/auth/login']);
        },
        complete: () => {
          this.isRefreshing = false;
        }
      });
    }

    return throwError(() => new Error('Session expirée. Veuillez vous reconnecter.'));
  }
}
