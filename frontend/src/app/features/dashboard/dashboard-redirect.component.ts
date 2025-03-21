import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  template: '<div>Redirection...</div>',
})
export class DashboardRedirectComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    
    if (user) {
      // Rediriger vers le tableau de bord correspondant au rôle de l'utilisateur
      switch (user.role) {
        case 'ADMIN':
          this.router.navigate(['/admin']);
          break;
        case 'SYNDIC':
          this.router.navigate(['/syndic/dashboard']);
          break;
        case 'PROPRIETAIRE':
          this.router.navigate(['/proprietaire/dashboard']);
          break;
        default:
          // Si le rôle n'est pas reconnu, rediriger vers la page d'accueil
          this.router.navigate(['/']);
      }
    } else {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      this.router.navigate(['/auth/login']);
    }
  }
} 