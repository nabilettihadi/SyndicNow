import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {catchError, exhaustMap, map, tap} from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';
import * as AuthActions from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$: Actions = inject(Actions)

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({credentials}) =>
        this.authService.login(credentials).pipe(
          map(user => AuthActions.loginSuccess({user})),
          catchError(error => of(AuthActions.loginFailure({error: error.message})))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/']))
      ),
    {dispatch: false}
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({userData}) =>
        this.authService.register(userData).pipe(
          map(user => AuthActions.registerSuccess({user})),
          catchError(error => {
            console.error('Register error:', error);
            const errorMessage = error.error?.message || 'Une erreur est survenue';
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
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    {dispatch: false}
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(error => {
            console.error('Logout error:', error);
            const errorMessage = error.error?.message || 'Une erreur est survenue';
            return of(AuthActions.logoutFailure({error: errorMessage}));
          })
        )
      )
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.router.navigate(['/auth/login']);
        })
      ),
    {dispatch: false}
  );
}
