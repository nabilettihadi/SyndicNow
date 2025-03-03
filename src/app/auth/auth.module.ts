import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/auth.effects';

@NgModule({
  imports: [
    // ... autres imports
    EffectsModule.forFeature([AuthEffects]),
  ],
  // ... reste de la configuration
})
export class AuthModule { } 