import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {catchError, exhaustMap, from, map, of, switchMap} from 'rxjs';
import {AuthService} from '@core/services/auth.service';
import * as AuthActions from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
  }

  readonly login = createEffect(() =>
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

  readonly loginSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        switchMap(() => {
          return from(this.router.navigate(['/dashboard'])).pipe(
            map(() => void 0)
          );
        })
      ),
    {dispatch: false}
  );

  readonly register = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({userData}) =>
        this.authService.register(userData).pipe(
          map(response => {
            const userWithActive = {...response, isActive: true};
            return AuthActions.registerSuccess({user: userWithActive});
          }),
          catchError(error => {
            console.error('Register error:', error);
            let errorMessage = 'Une erreur est survenue lors de l\'inscription';
            if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.message) {
              errorMessage = error.message;
            }
            return of(AuthActions.registerFailure({error: errorMessage}));
          })
        )
      )
    )
  );

  readonly registerSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        switchMap(() => {
          return from(this.router.navigate(['/dashboard'])).pipe(
            map(() => void 0)
          );
        })
      ),
    {dispatch: false}
  );

  readonly logout = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(error => of(AuthActions.logoutFailure({error: error.message})))
        )
      )
    )
  );

  readonly logoutSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        switchMap(() => {
          return from(this.router.navigate(['/auth/login'])).pipe(
            map(() => void 0)
          );
        })
      ),
    {dispatch: false}
  );
}
