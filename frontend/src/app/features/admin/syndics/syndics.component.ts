import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-syndics',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Gestion des Syndics</h1>
      <!-- Contenu à implémenter -->
    </div>
  `,
  styles: []
})
export class SyndicsComponent {}
