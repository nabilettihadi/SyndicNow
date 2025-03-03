import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-login',
  template: `
    <button (click)="onLogin()">Login</button>
  `
})
export class LoginComponent {
  constructor(private store: Store) {}

  onLogin() {
    this.store.dispatch(AuthActions.login({
      username: 'test',
      password: 'test'
    }));
  }
} 