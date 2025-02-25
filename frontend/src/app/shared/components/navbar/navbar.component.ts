import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a routerLink="/" class="text-xl font-bold text-gray-800">SyndicNow</a>
          </div>
          <div class="flex items-center space-x-4">
            <a routerLink="/auth/login" class="text-gray-600 hover:text-gray-900">Login</a>
            <a routerLink="/auth/register" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Register</a>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {}
