import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../store/actions/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../store/selectors/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.store.dispatch(login({ credentials: this.loginForm.value }));
    }
  }
}
