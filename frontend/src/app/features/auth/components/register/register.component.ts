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

  roles = [
    { value: 'PROPRIETAIRE', label: 'Propriétaire' },
    { value: 'SYNDIC', label: 'Syndic' }
  ];

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: AuthState }>
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      cin: ['', [Validators.required, Validators.minLength(6)]],
      role: ['PROPRIETAIRE', [Validators.required]],
      siret: [''],
      numeroLicence: [''],
      societe: [''],
      dateDebutActivite: [''],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[\w\W]{6,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });

    this.loading$ = this.store.select(state => state.auth.loading);
    this.error$ = this.store.select(state => state.auth.error);

    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.updateValidators(role);
    });
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.registerFailure({error: null}));
  }

  private updateValidators(role: string): void {
    const siretControl = this.registerForm.get('siret');
    const numeroLicenceControl = this.registerForm.get('numeroLicence');
    const societeControl = this.registerForm.get('societe');
    const dateDebutActiviteControl = this.registerForm.get('dateDebutActivite');

    if (role === 'SYNDIC') {
      siretControl?.setValidators([Validators.required, Validators.pattern(/^[0-9]{14}$/)]);
      numeroLicenceControl?.setValidators([Validators.required]);
      societeControl?.setValidators([Validators.required]);
      dateDebutActiviteControl?.setValidators([Validators.required]);
    } else {
      siretControl?.clearValidators();
      numeroLicenceControl?.clearValidators();
      societeControl?.clearValidators();
      dateDebutActiviteControl?.clearValidators();
    }

    siretControl?.updateValueAndValidity();
    numeroLicenceControl?.updateValueAndValidity();
    societeControl?.updateValueAndValidity();
    dateDebutActiviteControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const {confirmPassword, ...formValue} = this.registerForm.value;
      
      if (formValue.role === 'PROPRIETAIRE') {
        const { siret, numeroLicence, societe, dateDebutActivite, ...proprietaireData } = formValue;
        this.store.dispatch(AuthActions.register({ userData: proprietaireData }));
      } else {
        // Format the date to ISO string for syndic registration
        const formattedData = {
          ...formValue,
          dateDebutActivite: formValue.dateDebutActivite ? new Date(formValue.dateDebutActivite).toISOString() : null
        };
        this.store.dispatch(AuthActions.register({ userData: formattedData }));
      }
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : {mismatch: true};
  }

  passwordContainsNumber(): boolean {
    const password = this.registerForm.get('password')?.value;
    return /\d/.test(password);
  }

  passwordContainsLetter(): boolean {
    const password = this.registerForm.get('password')?.value;
    return /[a-zA-Z]/.test(password);
  }
}
