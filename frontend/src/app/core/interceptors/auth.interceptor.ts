import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AuthState} from '../../features/auth/models/auth.model';
import * as AuthActions from '../../features/auth/store/actions/auth.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private store: Store<{ auth: AuthState }>
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Récupérer l'utilisateur du localStorage
    const userStr = localStorage.getItem('currentUser');
    let token = null;
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user.token;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }

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
          // Token expiré ou invalide
          this.store.dispatch(AuthActions.logout());
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
