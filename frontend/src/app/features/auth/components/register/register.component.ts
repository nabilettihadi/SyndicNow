import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

import * as AuthActions from '../../store/actions/auth.actions';
import {AuthState} from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: AuthState }>
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });

    this.loading$ = this.store.select(state => state.auth.loading);
    this.error$ = this.store.select(state => state.auth.error);
  }

  ngOnInit(): void {
    // Clear any previous error messages
    this.store.dispatch(AuthActions.registerFailure({error: null}));
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : {mismatch: true};
  }

  passwordContainsNumber(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password ? /\d/.test(password) : false;
  }

  passwordContainsLetter(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password ? /[A-Za-z]/.test(password) : false;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const {confirmPassword, ...credentials} = this.registerForm.value;
      this.store.dispatch(AuthActions.register({credentials}));
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
