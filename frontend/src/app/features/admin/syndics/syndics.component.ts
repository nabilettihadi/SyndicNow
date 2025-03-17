import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';

@Component({
  selector: 'app-syndics',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar></app-navbar>
      <div class="container mx-auto p-4 flex-grow">
        <h1 class="text-2xl font-bold mb-4">Gestion des Syndics</h1>
        <!-- Contenu à implémenter -->
      </div>
      <app-footer></app-footer>
    </div>
  `,
  styles: []
})
export class SyndicsComponent {}
