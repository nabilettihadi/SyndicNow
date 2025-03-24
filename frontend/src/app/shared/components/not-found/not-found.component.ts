import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div class="text-center">
            <h1 class="text-9xl font-bold text-primary-600">404</h1>
            <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
              Page non trouvée
            </h2>
            <p class="mt-2 text-sm text-gray-600">
              Désolé, la page que vous recherchez n'existe pas.
            </p>
            <div class="mt-6">
              <a routerLink="/"
                 class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Retour à l'accueil
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
