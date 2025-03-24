import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-proprietaires',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './proprietaires.component.html'
})
export class ProprietairesComponent {
}
