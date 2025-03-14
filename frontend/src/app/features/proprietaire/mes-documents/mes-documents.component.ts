import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mes-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Mes Documents</h1>

      <!-- Filtres -->
      <div class="mb-6 flex gap-4">
        <select class="form-select rounded-md border-gray-300">
          <option value="">Tous les types</option>
          <option value="contrat">Contrats</option>
          <option value="facture">Factures</option>
          <option value="quittance">Quittances</option>
          <option value="autre">Autres</option>
        </select>
        <input type="month" class="form-input rounded-md border-gray-300" placeholder="Période">
      </div>

      <!-- Liste des documents -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Document -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <div class="p-3 bg-indigo-100 rounded-lg">
              <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Quittance de loyer</h3>
              <p class="text-sm text-gray-500">Mars 2024</p>
            </div>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-500">PDF - 245 Ko</span>
            <div class="flex space-x-3">
              <button class="text-indigo-600 hover:text-indigo-900">Aperçu</button>
              <button class="text-blue-600 hover:text-blue-900">Télécharger</button>
            </div>
          </div>
        </div>

        <!-- Document -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Contrat de location</h3>
              <p class="text-sm text-gray-500">Janvier 2024</p>
            </div>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-500">PDF - 1.2 Mo</span>
            <div class="flex space-x-3">
              <button class="text-indigo-600 hover:text-indigo-900">Aperçu</button>
              <button class="text-blue-600 hover:text-blue-900">Télécharger</button>
            </div>
          </div>
        </div>

        <!-- Document -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <div class="p-3 bg-yellow-100 rounded-lg">
              <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Facture travaux</h3>
              <p class="text-sm text-gray-500">Février 2024</p>
            </div>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-500">PDF - 856 Ko</span>
            <div class="flex space-x-3">
              <button class="text-indigo-600 hover:text-indigo-900">Aperçu</button>
              <button class="text-blue-600 hover:text-blue-900">Télécharger</button>
            </div>
          </div>
        </div>
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
export class MesDocumentsComponent {} 