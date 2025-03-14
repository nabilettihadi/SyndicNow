import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mes-appartements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Mes Appartements</h1>

      <!-- Liste des appartements -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Carte d'appartement -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="relative h-48">
            <img src="assets/images/placeholder-apartment.jpg" alt="Appartement" class="w-full h-full object-cover">
            <span class="absolute top-4 right-4 px-2 py-1 bg-green-500 text-white text-sm rounded-full">
              Occupé
            </span>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Appartement A101</h3>
            <p class="text-gray-600 mb-4">Résidence Les Roses</p>
            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span class="text-gray-500">Surface</span>
                <p class="font-medium">75 m²</p>
              </div>
              <div>
                <span class="text-gray-500">Étage</span>
                <p class="font-medium">1er</p>
              </div>
              <div>
                <span class="text-gray-500">Charges mensuelles</span>
                <p class="font-medium">150 €</p>
              </div>
              <div>
                <span class="text-gray-500">État des paiements</span>
                <p class="font-medium text-green-600">À jour</p>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <button class="text-indigo-600 hover:text-indigo-900">Voir les détails</button>
              <button class="text-blue-600 hover:text-blue-900">Documents</button>
            </div>
          </div>
        </div>

        <!-- Répéter pour d'autres appartements -->
      </div>
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
export class MesAppartementsComponent {} 