import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-gray-800 text-white mt-auto">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- À propos -->
          <div>
            <h3 class="text-lg font-semibold mb-4">À propos</h3>
            <p class="text-gray-400">
              SyndicNow est votre solution complète pour la gestion immobilière moderne et efficace.
            </p>
          </div>

          <!-- Liens rapides -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul class="space-y-2">
              <li><a routerLink="/dashboard" class="text-gray-400 hover:text-white">Dashboard</a></li>
              <li><a routerLink="/profile" class="text-gray-400 hover:text-white">Mon profil</a></li>
              <li><a routerLink="/contact" class="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact</h3>
            <ul class="space-y-2 text-gray-400">
              <li>Email: contact@syndicnow.com</li>
              <li>Tél: +33 1 23 45 67 89</li>
              <li>Adresse: 123 Rue de la Paix, Paris</li>
            </ul>
          </div>

          <!-- Réseaux sociaux -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white">
                <i class="fab fa-facebook"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <i class="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; ${new Date().getFullYear()} SyndicNow. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {}
