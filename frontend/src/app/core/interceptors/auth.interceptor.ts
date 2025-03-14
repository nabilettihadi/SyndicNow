import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthState } from '../authentication/store/reducers/auth.reducer';
import * as AuthActions from '../authentication/store/actions/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned).pipe(
      catchError(error => {
        if (error.status === 401) {
          authService.logout().subscribe(() => {
            router.navigate(['/auth/login']);
          });
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
