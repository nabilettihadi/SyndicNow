import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AuthState} from '../../features/auth/models/auth.model';
import * as AuthActions from '../../features/auth/store/actions/auth.actions';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private store: Store<{ auth: AuthState }>,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    console.log('=== Intercepteur HTTP ===');
    console.log('Token trouvé:', !!token);
    
    if (token) {
      console.log('Token intercepté:', token);
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('En-tête Authorization ajouté à la requête');
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur HTTP:', error);
        
        if (error.status === 403) {
          console.error('Erreur 403 - Accès refusé. Token:', token);
          console.error('Headers de la requête:', request.headers.keys());
        }
        
        if (error.status === 401 || error.status === 403) {
          console.log('Erreur d\'authentification détectée');
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
