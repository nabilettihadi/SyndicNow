import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-mes-paiements',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar></app-navbar>
      <div class="container mx-auto px-4 py-8 flex-grow">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Mes Paiements</h1>

        <!-- Résumé -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Prochain paiement</h3>
            <p class="text-2xl font-bold text-indigo-600">150 €</p>
            <p class="text-sm text-gray-500">Échéance : 31/03/2024</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Total payé (2024)</h3>
            <p class="text-2xl font-bold text-green-600">450 €</p>
            <p class="text-sm text-gray-500">3 paiements effectués</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-medium text-gray-900 mb-2">État des paiements</h3>
            <p class="text-2xl font-bold text-green-600">À jour</p>
            <p class="text-sm text-gray-500">Aucun retard</p>
          </div>
        </div>

        <!-- Filtres -->
        <div class="mb-6 flex gap-4">
          <select class="form-select rounded-md border-gray-300">
            <option value="">Tous les types</option>
            <option value="charges">Charges mensuelles</option>
            <option value="travaux">Travaux</option>
            <option value="autres">Autres</option>
          </select>
          <input type="month" class="form-input rounded-md border-gray-300" placeholder="Période">
        </div>

        <!-- Historique des paiements -->
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">01/03/2024</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Charges mensuelles</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">150 €</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Carte bancaire</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Payé
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900">Télécharger le reçu</button>
                  </td>
                </tr>
              </tbody>
            </table>
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
export class MesPaiementsComponent {} 