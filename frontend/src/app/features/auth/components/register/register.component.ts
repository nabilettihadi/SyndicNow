import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

import * as AuthActions from '../../store/actions/auth.actions';
import {AuthState, UserRole} from '../../models/auth.model';

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

  roles = [
    {value: UserRole.PROPRIETAIRE, label: 'Propriétaire'},
    {value: UserRole.SYNDIC, label: 'Syndic'}
  ];

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<{ auth: AuthState }>
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[\w\W]{6,}$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      cin: ['', [Validators.required, Validators.minLength(6)]],
      role: [UserRole.PROPRIETAIRE, [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });

    this.loading$ = this.store.select(state => state.auth.loading);
    this.error$ = this.store.select(state => state.auth.error);
  }

  ngOnInit(): void {
    // Réinitialiser l'état d'erreur au chargement du composant
    this.store.dispatch(AuthActions.registerFailure({error: ''}));
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const {confirmPassword, ...userData} = this.registerForm.value;
      this.store.dispatch(AuthActions.register({userData}));
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  passwordContainsLetter(): boolean {
    const password = this.registerForm.get('password')?.value;
    return /[a-zA-Z]/.test(password);
  }

  passwordContainsNumber(): boolean {
    const password = this.registerForm.get('password')?.value;
    return /\d/.test(password);
  }

  private passwordMatchValidator(group: FormGroup): {[key: string]: any} | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return {mismatch: true};
    }
    return null;
  }
}
