import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { LoginResponse } from '@core/authentication/models/auth.model';
import { Router } from '@angular/router';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  profilForm!: FormGroup;
  currentUser: LoginResponse | null = null;
  loading = false;
  error: string | null = null;
  isSuccessful = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.initForm(user);
      }
      this.loading = false;
    });
  }

  initForm(user: LoginResponse): void {
    this.profilForm = this.formBuilder.group({
      email: [user.email, [Validators.required, Validators.email]],
      nom: [user.nom, [Validators.required]],
      prenom: [user.prenom, [Validators.required]],
      // Mot de passe optionnel pour la mise à jour
      password: ['', [Validators.minLength(6)]],
      // Champs obligatoires supplémentaires basés sur le DTO SyndicRequest
      telephone: ['0612345678', [Validators.required]],
      adresse: ['', []],
      cin: ['CIN12345', [Validators.required]],
      numeroLicence: ['LIC12345', [Validators.required]],
      siret: ['12345678901234', [Validators.required]],
      societe: ['Ma Société', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.profilForm.invalid || !this.currentUser) {
      console.error('Formulaire invalide', this.profilForm.errors);
      return;
    }

    this.loading = true;
    const userData = {
      ...this.profilForm.value
    };

    // Si le mot de passe est vide, le supprimer de l'objet pour ne pas l'envoyer au serveur
    if (!userData.password) {
      delete userData.password;
    }

    console.log('Données envoyées au serveur:', userData);

    this.userService.updateProfile(userData).subscribe({
      next: (updatedUser) => {
        this.loading = false;
        this.isSuccessful = true;
        console.log('Profil mis à jour avec succès:', updatedUser);
        setTimeout(() => {
          this.isSuccessful = false;
        }, 3000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Erreur détaillée:', error);
        this.error = error.error?.message || error.message || 'Une erreur est survenue lors de la mise à jour';
        if (error.error?.details) {
          this.error += ': ' + error.error.details.join(', ');
        }
        setTimeout(() => {
          this.error = null;
        }, 5000);
      }
    });
  }

  getUserSince(): string {
    // Comme la propriété createdAt n'existe pas dans LoginResponse,
    // on retourne une date fixe ou on peut utiliser la date courante
    // formatée comme si l'utilisateur venait de s'inscrire
    return '01/01/2023';
  }
}
