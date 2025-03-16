import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AppartementService } from '../../../core/services/appartement.service';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mes-appartements',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar></app-navbar>
      <div class="container mx-auto px-4 py-8 flex-grow">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Mes Appartements</h1>
        
        <!-- Message d'erreur -->
        <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong class="font-bold">Erreur!</strong>
          <span class="block sm:inline"> {{error}}</span>
        </div>

        <!-- Message de chargement -->
        <div *ngIf="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>

        <!-- Liste des appartements -->
        <div *ngIf="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Message si aucun appartement -->
          <div *ngIf="appartements.length === 0" class="col-span-full text-center py-8">
            <p class="text-gray-500">Vous n'avez pas encore d'appartements.</p>
          </div>

          <!-- Carte d'appartement -->
          <div *ngFor="let appartement of appartements" class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="relative h-48">
              <img [src]="appartement.image || 'assets/images/placeholder-apartment.jpg'" [alt]="'Appartement ' + appartement.numero" class="w-full h-full object-cover">
              <span class="absolute top-4 right-4 px-2 py-1" 
                    [ngClass]="{'bg-green-500': appartement.statut === 'OCCUPE', 'bg-red-500': appartement.statut === 'LIBRE'}"
                    class="text-white text-sm rounded-full">
                {{appartement.statut}}
              </span>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Appartement {{appartement.numero}}</h3>
              <p class="text-gray-600 mb-4">{{appartement.residence}}</p>
              <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span class="text-gray-500">Surface</span>
                  <p class="font-medium">{{appartement.surface}} m²</p>
                </div>
                <div>
                  <span class="text-gray-500">Étage</span>
                  <p class="font-medium">{{appartement.etage}}{{appartement.etage === 1 ? 'er' : 'ème'}}</p>
                </div>
                <div>
                  <span class="text-gray-500">Charges mensuelles</span>
                  <p class="font-medium">{{appartement.charges}} €</p>
                </div>
                <div>
                  <span class="text-gray-500">État des paiements</span>
                  <p class="font-medium" [ngClass]="{'text-green-600': appartement.etatPaiements === 'A_JOUR', 'text-red-600': appartement.etatPaiements === 'EN_RETARD'}">
                    {{appartement.etatPaiements === 'A_JOUR' ? 'À jour' : 'En retard'}}
                  </p>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <button [routerLink]="['/proprietaire/appartement', appartement.id]" class="text-indigo-600 hover:text-indigo-900">
                  Voir les détails
                </button>
                <button [routerLink]="['/proprietaire/documents', appartement.id]" class="text-blue-600 hover:text-blue-900">
                  Documents
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f3f4f6;
    }
  `]
})
export class MesAppartementsComponent implements OnInit {
  appartements: any[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private appartementService: AppartementService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    console.log('Current user:', currentUser);
    console.log('Is authenticated:', this.authService.isAuthenticated());
    console.log('Has PROPRIETAIRE role:', this.authService.hasRole('PROPRIETAIRE'));
    console.log('Token:', this.authService.getToken());

    const userId = currentUser?.userId;
    if (userId) {
      this.loading = true;
      this.error = null;
      console.log('Fetching apartments for user:', userId);
      this.appartementService.getAppartementsProprietaire(userId)
        .subscribe({
          next: (data) => {
            console.log('Apartments data:', data);
            this.appartements = data;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading apartments:', error);
            this.error = error.message;
            this.loading = false;
          }
        });
    } else {
      this.error = 'Utilisateur non connecté';
      console.error('No user ID found');
    }
  }
} 