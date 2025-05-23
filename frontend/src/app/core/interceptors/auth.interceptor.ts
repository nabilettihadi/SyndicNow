import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  console.log('Auth interceptor - Request URL:', req.url);
  console.log('Auth interceptor - Token present:', !!token);

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    console.log('Auth interceptor - Request headers:', cloned.headers.keys());

    return next(cloned).pipe(
      catchError(error => {
        console.error('Auth interceptor - Error:', error);
        if (error.status === 401) {
          console.log('Auth interceptor - Unauthorized, logging out');
          authService.logout().subscribe(() => {
            router.navigate(['/auth/login']);
          });
        } else if (error.status === 403) {
          console.log('Auth interceptor - Forbidden, access denied');
          return throwError(() => ({
            ...error,
            message: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.'
          }));
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
