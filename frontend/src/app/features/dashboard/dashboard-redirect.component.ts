import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@core/models/user.model';

@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center h-screen bg-gray-50">
      <div class="text-center p-8">
        <div class="mb-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
        </div>
        <p class="text-gray-600">Redirection vers votre tableau de bord...</p>
      </div>
    </div>
  `
})
export class DashboardRedirectComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      console.log('Aucun utilisateur connecté, redirection vers la page de connexion');
      this.router.navigate(['/auth/login']);
      return;
    }

    const role = currentUser.role;
    console.log('Rôle détecté:', role);

    // Rediriger en fonction du rôle
    if (role === UserRole.ADMIN) {
      console.log('Redirection vers le tableau de bord administrateur');
      this.router.navigate(['/admin']);
    } else if (role === UserRole.SYNDIC) {
      console.log('Redirection vers le tableau de bord syndic');
      this.router.navigate(['/syndic']);
    } else if (role === UserRole.PROPRIETAIRE) {
      console.log('Redirection vers le tableau de bord propriétaire');
      this.router.navigate(['/proprietaire']);
    } else {
      console.log('Rôle non reconnu, redirection vers la page d\'accueil');
      this.router.navigate(['/']);
    }
  }
} 