import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {AuthRoutingModule} from './auth-routing.module';
import {AuthEffects} from './store/effects/auth.effects';
import {authReducer} from './store/reducers/auth.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthRoutingModule,
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature(AuthEffects)
  ],
  providers: [AuthEffects]
})
export class AuthModule {
}
