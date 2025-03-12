import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-immeubles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Gestion des Immeubles</h2>
      <p>Cette fonctionnalité sera bientôt disponible.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
    }
    h2 {
      color: #2d3748;
      margin-bottom: 1rem;
    }
  `]
})
export class ImmeublesComponent {} 