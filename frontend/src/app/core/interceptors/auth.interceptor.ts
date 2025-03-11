import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../features/auth/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // Ne pas ajouter le token pour les requêtes d'authentification
        if (request.url.includes('/auth/authenticate') || request.url.includes('/auth/register')) {
            return next.handle(request);
        }

        const token = this.authService.getToken();
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Si on reçoit une erreur 401, on déconnecte l'utilisateur
                    this.authService.logout().subscribe(() => {
                        this.router.navigate(['/auth/login']);
                    });
                }
                return throwError(() => error);
            })
        );
    }
}
