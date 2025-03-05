import {Injectable, inject} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import * as AuthActions from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({credentials}) =>
        this.authService.login(credentials).pipe(
          map(response => AuthActions.loginSuccess({user: response})),
          catchError(error => {
            console.error('Login error:', error);
            const errorMessage = error.error?.message || 'Une erreur est survenue lors de la connexion';
            return of(AuthActions.loginFailure({error: errorMessage}));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    {dispatch: false}
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({credentials}) =>
        this.authService.register(credentials).pipe(
          map(response => AuthActions.registerSuccess({user: response})),
          catchError(error => {
            console.error('Register error:', error);
            const errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'inscription';
            return of(AuthActions.registerFailure({error: errorMessage}));
          })
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    {dispatch: false}
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => {
        this.authService.logout();
        return AuthActions.logoutSuccess();
      })
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate(['/auth/login']))
      ),
    {dispatch: false}
  );
}