import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {Store} from '@ngrx/store';
import {register} from '@core/authentication/store/actions/auth.actions';
import {AuthState, RegisterRequest} from '@core/authentication/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;

  roles = [
    {value: 'SYNDIC', label: 'Syndic'},
    {value: 'PROPRIETAIRE', label: 'Propriétaire'}
  ];

  preferenceCommunications = [
    {value: 'EMAIL', label: 'Email'},
    {value: 'TELEPHONE', label: 'Téléphone'}
  ];

  typeProprietaires = [
    {value: 'PERSONNE_PHYSIQUE', label: 'Personne physique'},
    {value: 'PERSONNE_MORALE', label: 'Personne morale'}
  ];

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(3)]],
      role: ['PROPRIETAIRE', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      cin: ['', [Validators.required, Validators.minLength(6)]],
      // Champs spécifiques au syndic
      siret: [''],
      numeroLicence: [''],
      societe: [''],
      dateDebutActivite: [''],
      // Champs spécifiques au propriétaire
      preferencesCommunication: ['EMAIL'],
      typeProprietaire: ['PERSONNE_PHYSIQUE']
    }, {validator: this.passwordMatchValidator});

    // Écouter les changements du rôle pour mettre à jour les validations
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.updateFormValidators(role);
    });
  }

  private updateFormValidators(role: string) {
    const syndicControls = ['siret', 'numeroLicence', 'societe', 'dateDebutActivite'];
    const proprietaireControls = ['preferencesCommunication', 'typeProprietaire'];

    if (role === 'SYNDIC') {
      this.registerForm.get('siret')?.setValidators([Validators.required, Validators.pattern(/^\d{14}$/)]);
      this.registerForm.get('numeroLicence')?.setValidators([Validators.required]);
      this.registerForm.get('societe')?.setValidators([Validators.required]);
      this.registerForm.get('dateDebutActivite')?.setValidators([Validators.required]);

      // Réinitialiser les contrôles propriétaire
      proprietaireControls.forEach(control => {
        this.registerForm.get(control)?.clearValidators();
        this.registerForm.get(control)?.setValue('');
      });
    } else if (role === 'PROPRIETAIRE') {
      // Réinitialiser les contrôles syndic
      syndicControls.forEach(control => {
        this.registerForm.get(control)?.clearValidators();
        this.registerForm.get(control)?.setValue('');
      });

      this.registerForm.get('preferencesCommunication')?.setValue('EMAIL');
      this.registerForm.get('typeProprietaire')?.setValue('PERSONNE_PHYSIQUE');
    }

    // Mettre à jour la validité de tous les contrôles
    [...syndicControls, ...proprietaireControls].forEach(control => {
      this.registerForm.get(control)?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = null;

      const formValue = this.registerForm.value;
      const userData: RegisterRequest = {
        email: formValue.email,
        password: formValue.password,
        nom: formValue.nom,
        prenom: formValue.prenom,
        role: formValue.role,
        telephone: formValue.telephone,
        adresse: formValue.adresse,
        cin: formValue.cin
      };

      // Ajouter les champs du syndic si nécessaire
      if (formValue.role === 'SYNDIC') {
        Object.assign(userData, {
          siret: formValue.siret,
          numeroLicence: formValue.numeroLicence,
          societe: formValue.societe,
          dateDebutActivite: formValue.dateDebutActivite
        });
      } else if (formValue.role === 'PROPRIETAIRE') {
        // Ajouter les champs du propriétaire
        Object.assign(userData, {
          preferencesCommunication: formValue.preferencesCommunication,
          typeProprietaire: formValue.typeProprietaire
        });
      }

      this.store.dispatch(register({userData}));
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return {mismatch: true};
    }
    return null;
  }

  passwordContainsLetter(): boolean {
    const password = this.registerForm.get('password')?.value;
    return /[a-zA-Z]/.test(password);
  }

  passwordContainsNumber(): boolean {
    const password = this.registerForm.get('password')?.value;
    return /\d/.test(password);
  }
}
