import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ImmeubleService} from '@core/services/immeuble.service';
import {AppartementService} from '@core/services/appartement.service';
import {Immeuble} from '@core/models/immeuble.model';
import {Appartement} from '@core/models/appartement.model';
import {SyndicService} from '@core/services/syndic.service';
import {Syndic} from '@core/models/syndic.model';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder} from '@angular/forms';

interface ImmeubleStats {
  total: number;
  occupied: number;
  maintenance: number;
  available: number;
  occupancyRate: number;
  availabilityRate: number;
  maintenanceRate: number;
}

@Component({
  selector: 'app-immeuble-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './immeuble-details.component.html'
})
export class ImmeubleDetailsComponent implements OnInit {
  immeuble: Immeuble | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  appartements: Appartement[] = [];
  isLoadingAppartements: boolean = false;
  appartementsError: string | null = null;

  // Suppression d'immeuble
  showDeleteModal: boolean = false;
  isDeleting: boolean = false;

  // Gestion du syndic
  showSyndicModal: boolean = false;
  availableSyndics: Syndic[] = [];
  selectedSyndicId: number | null = null;
  isLoadingSyndics: boolean = false;
  isSavingSyndic: boolean = false;
  syndicError: string | null = null;

  // Ajouter une propriété pour indiquer si des données de secours sont utilisées
  usingMockData: boolean = false;

  stats: ImmeubleStats = {
    total: 0,
    occupied: 0,
    maintenance: 0,
    available: 0,
    occupancyRate: 0,
    availabilityRate: 0,
    maintenanceRate: 0
  };

  private toastr = inject(ToastrService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private immeubleService: ImmeubleService,
    private syndicService: SyndicService,
    private appartementService: AppartementService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadImmeuble(id);
      }
    });
  }

  loadImmeuble(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.immeubleService.getImmeubleById(id).subscribe({
      next: (data) => {
        this.immeuble = data;
        this.isLoading = false;
        // Charger les appartements après avoir chargé l'immeuble
        this.loadAppartements();
        // Mettre à jour les statistiques
        this.updateStatistics();
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'immeuble:', error);
        this.error = 'Impossible de charger les détails de l\'immeuble';
        this.isLoading = false;
      }
    });
  }

  loadAppartements(): void {
    if (!this.immeuble?.id) return;

    this.isLoadingAppartements = true;
    this.appartementsError = null;

    this.appartementService.getAppartementsByImmeuble(this.immeuble.id).subscribe({
      next: (data) => {
        this.appartements = data;
        this.isLoadingAppartements = false;
        this.updateStatistics();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des appartements:', error);
        this.appartementsError = 'Impossible de charger les appartements';
        this.isLoadingAppartements = false;
      }
    });
  }

  updateStatistics(): void {
    if (!this.immeuble) return;

    // Mettre à jour le nombre total d'appartements
    this.immeuble.nombreAppartements = this.appartements.length;

    // Calculer les statistiques
    const occupied = this.getOccupiedAppartements();
    const maintenance = this.getMaintenanceAppartements();
    const available = this.getFreeAppartements();

    // Mettre à jour l'affichage des statistiques
    this.stats = {
      total: this.appartements.length,
      occupied: occupied,
      maintenance: maintenance,
      available: available,
      occupancyRate: this.getOccupancyRate(),
      availabilityRate: this.getAvailabilityRate(),
      maintenanceRate: this.getMaintenanceRate()
    };
  }

  getOccupiedAppartements(): number {
    return this.appartements.filter(a => a.status === 'OCCUPE').length;
  }

  getFreeAppartements(): number {
    return this.appartements.filter(a => a.status === 'LIBRE').length;
  }

  getMaintenanceAppartements(): number {
    return this.appartements.filter(a => a.status === 'EN_TRAVAUX').length;
  }

  getOccupancyRate(): number {
    return this.appartements.length > 0
      ? (this.getOccupiedAppartements() / this.appartements.length) * 100
      : 0;
  }

  getAvailabilityRate(): number {
    return this.appartements.length > 0
      ? (this.getFreeAppartements() / this.appartements.length) * 100
      : 0;
  }

  getMaintenanceRate(): number {
    return this.appartements.length > 0
      ? (this.getMaintenanceAppartements() / this.appartements.length) * 100
      : 0;
  }

  getTotalAppartements(): number {
    return this.appartements.length;
  }

  // Méthodes utilitaires
  formatDate(date: Date | string | null): string {
    if (!date) return 'Non disponible';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'ACTIF':
        return 'Actif';
      case 'EN_TRAVAUX':
        return 'En travaux';
      case 'INACTIF':
        return 'Inactif';
      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIF':
        return 'bg-green-100 text-green-800';
      case 'EN_TRAVAUX':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIF':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getAppartementStatusClass(status: string): string {
    switch (status) {
      case 'OCCUPE':
        return 'bg-green-100 text-green-800';
      case 'LIBRE':
        return 'bg-blue-100 text-blue-800';
      case 'EN_TRAVAUX':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Gestion de la suppression
  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  deleteImmeuble(): void {
    if (!this.immeuble) return;

    this.isDeleting = true;

    this.immeubleService.deleteImmeuble(this.immeuble.id).subscribe({
      next: () => {
        this.toastr.success(`L'immeuble "${this.immeuble?.nom}" a été supprimé avec succès.`);
        this.router.navigate(['/admin/immeubles']);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l\'immeuble', err);
        this.toastr.error('Impossible de supprimer l\'immeuble. Veuillez réessayer plus tard.');
        this.isDeleting = false;
        this.showDeleteModal = false;
      }
    });
  }

  // Gestion du syndic
  changerSyndic(): void {
    this.isLoadingSyndics = true;
    this.syndicError = null;
    this.selectedSyndicId = null;
    this.showSyndicModal = true;

    this.syndicService.getAllSyndics().subscribe({
      next: (data) => {
        // Filtrer pour exclure le syndic actuel et ne garder que les syndics actifs
        this.availableSyndics = data.filter(s => 
          s.status === 'ACTIF' && s.id !== this.immeuble?.syndic?.id
        );
        this.isLoadingSyndics = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des syndics', err);
        this.syndicError = 'Impossible de charger la liste des syndics disponibles.';
        this.isLoadingSyndics = false;
      }
    });
  }

  assignerSyndic(): void {
    if (!this.selectedSyndicId || !this.immeuble?.id) return;

    this.isSavingSyndic = true;
    this.syndicError = null;

    this.immeubleService.assignerSyndicImmeuble(this.immeuble.id, this.selectedSyndicId).subscribe({
      next: (updatedImmeuble) => {
        this.immeuble = updatedImmeuble;
        this.showSyndicModal = false;
        this.selectedSyndicId = null;
        this.toastr.success('Le syndic a été changé avec succès');
        this.isSavingSyndic = false;
      },
      error: (error) => {
        console.error('Erreur lors du changement du syndic:', error);
        this.syndicError = 'Impossible de changer le syndic';
        this.isSavingSyndic = false;
      }
    });
  }

  retirerSyndic(): void {
    if (!this.immeuble?.id) return;

    this.isSavingSyndic = true;
    this.syndicError = null;

    this.immeubleService.retirerSyndicImmeuble(this.immeuble.id).subscribe({
      next: (updatedImmeuble) => {
        this.immeuble = updatedImmeuble;
        this.toastr.success('Le syndic a été retiré avec succès');
        this.isSavingSyndic = false;
      },
      error: (error) => {
        console.error('Erreur lors du retrait du syndic:', error);
        this.syndicError = 'Impossible de retirer le syndic';
        this.isSavingSyndic = false;
      }
    });
  }

  cancelSyndicModal(): void {
    this.showSyndicModal = false;
    this.selectedSyndicId = null;
    this.syndicError = null;
    this.isSavingSyndic = false;
  }

  // Gestion des appartements
  ajouterAppartement(): void {
    if (this.immeuble?.id) {
      this.router.navigate(['/admin/immeubles', this.immeuble.id, 'appartements', 'nouveau']);
    }
  }

  modifierImmeuble(): void {
    if (this.immeuble?.id) {
      this.router.navigate(['/admin/immeubles', this.immeuble.id, 'modifier']);
    }
  }

  gererAppartements(): void {
    if (this.immeuble?.id) {
      this.router.navigate(['/admin/immeubles', this.immeuble.id, 'appartements']);
    }
  }
}
