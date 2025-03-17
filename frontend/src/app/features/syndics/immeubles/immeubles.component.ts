import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ImmeubleService} from '@core/services/immeuble.service';
import {Immeuble} from '@core/models/immeuble.model';
import {AuthService} from '@core/services/auth.service';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {FooterComponent} from '@shared/components/footer/footer.component';

@Component({
  selector: 'app-immeubles',
  templateUrl: './immeubles.component.html',
  styleUrls: ['./immeubles.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent]
})
export class ImmeublesComponent implements OnInit {
  immeubles: Immeuble[] = [];
  loading = true;
  error: string | null = null;
  searchTerm: string = '';
  filteredImmeubles: Immeuble[] = [];

  constructor(
    private immeubleService: ImmeubleService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    const syndicId = this.authService.getCurrentUser()?.userId;
    if (syndicId) {
      this.loadImmeubles(Number(syndicId));
    }
  }

  loadImmeubles(syndicId: number): void {
    this.immeubleService.getImmeublesBySyndic(syndicId).subscribe({
      next: (data: Immeuble[]) => {
        this.immeubles = data;
        this.filteredImmeubles = data;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Erreur lors du chargement des immeubles';
        this.loading = false;
      }
    });
  }

  filterImmeubles(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase();
    this.filteredImmeubles = this.immeubles.filter(immeuble =>
      immeuble.nom.toLowerCase().includes(this.searchTerm) ||
      immeuble.adresse.toLowerCase().includes(this.searchTerm) ||
      immeuble.ville.toLowerCase().includes(this.searchTerm)
    );
  }

  deleteImmeuble(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet immeuble ?')) {
      this.immeubleService.deleteImmeuble(id).subscribe({
        next: () => {
          this.immeubles = this.immeubles.filter(im => im.id !== id);
          this.filteredImmeubles = this.filteredImmeubles.filter(im => im.id !== id);
        },
        error: (error: Error) => {
          this.error = 'Erreur lors de la suppression de l\'immeuble';
        }
      });
    }
  }
}
