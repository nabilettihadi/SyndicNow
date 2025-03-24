import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProprietaireService } from '@core/services/proprietaire.service';
import { Proprietaire } from '@core/models/proprietaire.model';

@Component({
  selector: 'app-detail-proprietaire',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detail-proprietaire.component.html'
})
export class DetailProprietaireComponent implements OnInit {
  proprietaire: Proprietaire | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private proprietaireService: ProprietaireService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProprietaire(+id);
    }
  }

  private loadProprietaire(id: number): void {
    this.isLoading = true;
    this.proprietaireService.getProprietaireById(id).subscribe({
      next: (data) => {
        this.proprietaire = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du propriétaire:', error);
        this.error = 'Impossible de charger les détails du propriétaire.';
        this.isLoading = false;
      }
    });
  }
} 