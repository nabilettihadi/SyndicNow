import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { PaiementService } from '../../../core/services/paiement.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mes-paiements',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar></app-navbar>
      <div class="container mx-auto px-4 py-8 flex-grow">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Mes Paiements</h1>

        <!-- Résumé -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Prochain paiement</h3>
            <p class="text-2xl font-bold text-indigo-600">{{prochainPaiement?.montant || 0}} €</p>
            <p class="text-sm text-gray-500">Échéance : {{prochainPaiement?.dateEcheance | date:'dd/MM/yyyy'}}</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Total payé ({{currentYear}})</h3>
            <p class="text-2xl font-bold text-green-600">{{totalPaye}} €</p>
            <p class="text-sm text-gray-500">{{nombrePaiements}} paiements effectués</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-medium text-gray-900 mb-2">État des paiements</h3>
            <p class="text-2xl font-bold" [ngClass]="{
              'text-green-600': etatPaiements === 'A_JOUR',
              'text-red-600': etatPaiements === 'EN_RETARD'
            }">{{etatPaiements === 'A_JOUR' ? 'À jour' : 'En retard'}}</p>
            <p class="text-sm text-gray-500">{{paiementsEnRetard}} paiement(s) en retard</p>
          </div>
        </div>

        <!-- Filtres -->
        <div class="mb-6 flex gap-4">
          <select [(ngModel)]="selectedType" (change)="filterPaiements()" class="form-select rounded-md border-gray-300">
            <option value="">Tous les types</option>
            <option value="CHARGES">Charges mensuelles</option>
            <option value="TRAVAUX">Travaux</option>
            <option value="AUTRES">Autres</option>
          </select>
          <input type="month" [(ngModel)]="selectedPeriod" (change)="filterPaiements()" class="form-input rounded-md border-gray-300">
        </div>

        <!-- Historique des paiements -->
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let paiement of filteredPaiements" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{paiement.date | date:'dd/MM/yyyy'}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{paiement.type}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{paiement.montant}} €</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{paiement.methodePaiement}}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [ngClass]="{
                            'bg-green-100 text-green-800': paiement.status === 'PAYE',
                            'bg-yellow-100 text-yellow-800': paiement.status === 'EN_ATTENTE',
                            'bg-red-100 text-red-800': paiement.status === 'EN_RETARD',
                            'bg-gray-100 text-gray-800': paiement.status === 'ANNULE'
                          }">
                      {{paiement.status}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button *ngIf="paiement.status === 'PAYE'" 
                            (click)="downloadRecu(paiement)" 
                            class="text-blue-600 hover:text-blue-900">
                      Télécharger le reçu
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f3f4f6;
    }
  `]
})
export class MesPaiementsComponent implements OnInit {
  paiements: any[] = [];
  filteredPaiements: any[] = [];
  selectedType: string = '';
  selectedPeriod: string = '';
  
  prochainPaiement: any = null;
  totalPaye: number = 0;
  nombrePaiements: number = 0;
  etatPaiements: string = 'A_JOUR';
  paiementsEnRetard: number = 0;
  currentYear: number = new Date().getFullYear();

  constructor(
    private paiementService: PaiementService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userId = this.authService.getCurrentUser()?.userId;
    if (userId) {
      this.loadPaiements(userId);
    }
  }

  loadPaiements(userId: number) {
    this.paiementService.getPaiementsByProprietaire(userId)
      .subscribe({
        next: (data) => {
          this.paiements = data;
          this.filterPaiements();
          this.updateStatistics();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des paiements:', error);
        }
      });
  }

  filterPaiements() {
    this.filteredPaiements = this.paiements.filter(paiement => {
      const typeMatch = !this.selectedType || paiement.type === this.selectedType;
      const periodMatch = !this.selectedPeriod || 
        new Date(paiement.date).toISOString().substring(0, 7) === this.selectedPeriod;
      return typeMatch && periodMatch;
    });
  }

  updateStatistics() {
    // Prochain paiement
    this.prochainPaiement = this.paiements
      .filter(p => p.status === 'EN_ATTENTE')
      .sort((a, b) => new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime())[0];

    // Total payé cette année
    const paiementsAnnee = this.paiements.filter(p => 
      new Date(p.date).getFullYear() === this.currentYear && 
      p.status === 'PAYE'
    );
    this.totalPaye = paiementsAnnee.reduce((sum, p) => sum + p.montant, 0);
    this.nombrePaiements = paiementsAnnee.length;

    // État des paiements
    this.paiementsEnRetard = this.paiements.filter(p => p.status === 'EN_RETARD').length;
    this.etatPaiements = this.paiementsEnRetard > 0 ? 'EN_RETARD' : 'A_JOUR';
  }

  downloadRecu(paiement: any) {
    this.paiementService.downloadRecu(paiement.id)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `recu-paiement-${paiement.id}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        error: (error) => {
          console.error('Erreur lors du téléchargement du reçu:', error);
        }
      });
  }
} 