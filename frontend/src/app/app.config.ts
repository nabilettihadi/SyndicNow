import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {provideHttpClient} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './core/interceptors/auth.interceptor';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AuthService} from './features/auth/services/auth.service';

import {routes} from './app.routes';
import {authReducer} from './features/auth/store/reducers/auth.reducer';
import {AuthEffects} from './features/auth/store/effects/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideStore({auth: authReducer}),
    provideEffects([AuthEffects]),
    provideHttpClient(),
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    })
  ]
};
