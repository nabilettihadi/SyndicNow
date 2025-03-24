import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class FooterComponent {
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
