import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ImmeubleService} from '@core/services/immeuble.service';
import {Immeuble, ImmeubleStats} from '@core/models/immeuble.model';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '@core/services/auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';

@Component({
  selector: 'app-list-immeubles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list-immeubles.component.html'
})
export class ListImmeublesComponent implements OnInit {

  // Propriétés de la classe
  immeubles: Immeuble[] = [];
  filteredImmeubles: Immeuble[] = [];
  stats: ImmeubleStats | null = null;
  searchTerm: string = '';
  filterVille: string = '';
  villes: string[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  userRole: string | null = null;

  // Suppression
  immeubleToDelete: Immeuble | null = null;
  isDeleting: boolean = false;

  constructor(
    private immeubleService: ImmeubleService,
    private toastr: ToastrService,
    private authService: AuthService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.userRole = this.authService.getCurrentUser()?.role || null;
    this.loadImmeubles();
    this.loadStats();
  }

  loadImmeubles(): void {
    this.isLoading = true;
    this.error = null;

    console.log("Chargement des immeubles avec le rôle:", this.userRole);

    this.immeubleService.getAllImmeubles().subscribe({
      next: (data) => {
        this.handleSuccessfulLoad(data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des immeubles', err);
        this.handleLoadError(err);
      }
    });
  }

  // Méthode simplifiée pour tester un endpoint
  testDirectEndpoint(endpoint: string): void {
    this.isLoading = true;
    this.error = `Test de l'endpoint: ${endpoint} en cours...`;

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const fullUrl = `${environment.apiUrl}/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    console.log(`Test direct de l'endpoint: ${fullUrl}`);

    this.http.get<Immeuble[]>(fullUrl, {headers}).subscribe({
      next: (data) => {
        console.log(`Succès avec l'endpoint ${endpoint}:`, data);
        this.toastr.success(`Endpoint ${endpoint} fonctionnel! ${data.length} immeubles récupérés.`);
        this.handleSuccessfulLoad(data);
      },
      error: (err) => {
        console.error(`Échec avec l'endpoint ${endpoint}:`, err);
        this.toastr.error(`Échec avec l'endpoint ${endpoint}: ${err.status} ${err.statusText}`);
        this.error = `Échec avec l'endpoint ${endpoint}: ${err.status} ${err.statusText}`;
        this.isLoading = false;
      }
    });
  }

  // Gestion d'un chargement réussi
  handleSuccessfulLoad(data: Immeuble[]): void {
    console.log("Données d'immeubles reçues:", data);
    this.immeubles = data;
    this.filteredImmeubles = [...this.immeubles];
    this.calculateStats();
    this.extractVilles();
    this.isLoading = false;

    // Si nous avons récupéré des données, afficher un message de succès
    if (data && data.length > 0) {
      this.toastr.success(`${data.length} immeubles récupérés avec succès depuis la base de données.`);
    } else {
      this.toastr.warning("Aucun immeuble trouvé dans la base de données.");
    }
  }

  // Gestion des erreurs de chargement
  handleLoadError(err: any): void {
    if (err.status === 403) {
      this.error = 'Accès refusé. Vous n\'avez pas les permissions nécessaires pour accéder à ces données.';
      this.toastr.error('Erreur d\'autorisation. Veuillez contacter l\'administrateur système.');
    } else if (err.status === 500) {
      this.error = 'Erreur serveur. Veuillez réessayer plus tard ou contacter l\'administrateur système.';
      this.toastr.error('Erreur serveur interne.');
    } else {
      this.error = err.message || 'Impossible de charger les immeubles. Veuillez réessayer plus tard.';
      this.toastr.error('Erreur de chargement des données.');
    }

    // Initialiser un tableau vide pour éviter des erreurs de rendu
    this.immeubles = [];
    this.filteredImmeubles = [];
    this.isLoading = false;
  }

  loadStats(): void {
    this.calculateStats();
  }

  calculateStats(): void {
    if (this.immeubles.length > 0) {
      const parVille: { [key: string]: number } = {};
      let totalEtages = 0;
      let totalAppartements = 0;

      this.immeubles.forEach(immeuble => {
        // Comptage par ville
        parVille[immeuble.ville] = (parVille[immeuble.ville] || 0) + 1;

        // Calcul des moyennes
        totalEtages += immeuble.nombreEtages;
        totalAppartements += immeuble.nombreAppartements;
      });

      this.stats = {
        total: this.immeubles.length,
        parVille,
        nombreEtagesMoyen: totalEtages / this.immeubles.length,
        nombreAppartementsMoyen: totalAppartements / this.immeubles.length
      };
    } else {
      this.stats = null;
    }
  }

  extractVilles(): void {
    this.villes = [...new Set(this.immeubles.map(i => i.ville))].sort();
  }

  applyFilters(): void {
    this.filteredImmeubles = this.immeubles;

    // Appliquer le filtre de recherche
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredImmeubles = this.filteredImmeubles.filter(immeuble =>
        immeuble.nom?.toLowerCase().includes(searchLower) ||
        immeuble.adresse?.toLowerCase().includes(searchLower) ||
        immeuble.ville?.toLowerCase().includes(searchLower)
      );
    }

    // Appliquer le filtre de ville
    if (this.filterVille) {
      this.filteredImmeubles = this.filteredImmeubles.filter(immeuble =>
        immeuble.ville === this.filterVille
      );
    }

    // Recalculer les statistiques
    this.calculateStats();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterVille = '';
    this.filteredImmeubles = [...this.immeubles];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIF':
        return 'bg-green-500 text-white px-3 py-1 rounded-full font-medium';
      case 'INACTIF':
        return 'bg-red-500 text-white px-3 py-1 rounded-full font-medium';
      case 'EN_TRAVAUX':
        return 'bg-yellow-500 text-white px-3 py-1 rounded-full font-medium';
      default:
        return 'bg-gray-500 text-white px-3 py-1 rounded-full font-medium';
    }
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'ACTIF':
        return 'Actif';
      case 'INACTIF':
        return 'Inactif';
      case 'EN_TRAVAUX':
        return 'En travaux';
      default:
        return status;
    }
  }

  confirmDelete(immeuble: Immeuble): void {
    this.immeubleToDelete = immeuble;
  }

  cancelDelete(): void {
    this.immeubleToDelete = null;
  }

  deleteImmeuble(): void {
    if (!this.immeubleToDelete) return;

    this.isDeleting = true;

    this.immeubleService.deleteImmeuble(this.immeubleToDelete.id).subscribe({
      next: () => {
        this.immeubles = this.immeubles.filter(i => i.id !== this.immeubleToDelete?.id);
        this.filteredImmeubles = this.filteredImmeubles.filter(i => i.id !== this.immeubleToDelete?.id);

        this.calculateStats();

        this.toastr.success(`L'immeuble "${this.immeubleToDelete?.nom}" a été supprimé avec succès.`);

        this.immeubleToDelete = null;
        this.isDeleting = false;
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l\'immeuble', err);
        this.toastr.error('Impossible de supprimer l\'immeuble. Veuillez réessayer plus tard.');
        this.isDeleting = false;
      }
    });
  }
}
