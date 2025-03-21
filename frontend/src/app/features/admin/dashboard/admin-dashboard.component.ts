import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, map, of } from 'rxjs';
import { UserService } from '@core/services/user.service';
import { SyndicService } from '@core/services/syndic.service';
import { ImmeubleService } from '@core/services/immeuble.service';
import { PaiementService } from '@core/services/paiement.service';

interface DashboardStats {
  usersCount: number;
  syndicsCount: number;
  immeublesCount: number;
  revenueTotal: number;
  recentActivity: any[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 class="text-2xl font-bold text-gray-900">
            Tableau de bord d'administration
          </h1>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- État du chargement -->
        <div *ngIf="isLoading" class="flex justify-center my-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>

        <!-- Message d'erreur -->
        <div *ngIf="error" class="rounded-md bg-red-50 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-red-400 text-xl"></i>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Une erreur est survenue
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{error}}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiques générales -->
        <div *ngIf="!isLoading && !error" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Utilisateurs -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="rounded-md bg-blue-50 p-3">
                    <i class="fas fa-users text-blue-600 text-xl"></i>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Utilisateurs totaux
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{stats.usersCount}}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <a routerLink="/admin/users" class="font-medium text-primary-600 hover:text-primary-500">
                  Voir tous les utilisateurs
                </a>
              </div>
            </div>
          </div>

          <!-- Syndics -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="rounded-md bg-green-50 p-3">
                    <i class="fas fa-user-tie text-green-600 text-xl"></i>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Syndics
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{stats.syndicsCount}}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <a routerLink="/admin/syndics" class="font-medium text-primary-600 hover:text-primary-500">
                  Gérer les syndics
                </a>
              </div>
            </div>
          </div>

          <!-- Immeubles -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="rounded-md bg-yellow-50 p-3">
                    <i class="fas fa-building text-yellow-600 text-xl"></i>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Immeubles
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{stats.immeublesCount}}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <a routerLink="/admin/immeubles" class="font-medium text-primary-600 hover:text-primary-500">
                  Voir tous les immeubles
                </a>
              </div>
            </div>
          </div>

          <!-- Revenus -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="rounded-md bg-purple-50 p-3">
                    <i class="fas fa-money-bill-wave text-purple-600 text-xl"></i>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Revenus totaux
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{stats.revenueTotal | currency:'MAD':'symbol':'1.0-0'}}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <a routerLink="/admin/rapports" class="font-medium text-primary-600 hover:text-primary-500">
                  Voir les rapports financiers
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Activité récente -->
        <div *ngIf="!isLoading && !error" class="mt-8">
          <h2 class="text-lg leading-6 font-medium text-gray-900">Activité récente</h2>
          <div class="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" class="divide-y divide-gray-200">
              <li *ngFor="let activity of stats.recentActivity">
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div [ngClass]="getActivityIconClass(activity.type)" class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center">
                        <i [class]="getActivityIcon(activity.type)"></i>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{activity.title}}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{activity.description}}
                        </div>
                      </div>
                    </div>
                    <div class="ml-2 flex-shrink-0 flex">
                      <div class="text-sm text-gray-500">
                        {{formatDate(activity.date)}}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Actions rapides -->
        <div *ngIf="!isLoading && !error" class="mt-8">
          <h2 class="text-lg leading-6 font-medium text-gray-900">Actions rapides</h2>
          <div class="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Ajouter un syndic</h3>
                <div class="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Créer un nouveau compte syndic pour gérer des immeubles.</p>
                </div>
                <div class="mt-5">
                  <a routerLink="/admin/syndics/add" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Ajouter un syndic
                  </a>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Ajouter un immeuble</h3>
                <div class="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Enregistrer un nouvel immeuble dans le système.</p>
                </div>
                <div class="mt-5">
                  <a routerLink="/admin/immeubles/add" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Ajouter un immeuble
                  </a>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Gérer les rapports</h3>
                <div class="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Consulter et générer des rapports d'activité.</p>
                </div>
                <div class="mt-5">
                  <a routerLink="/admin/rapports" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Voir les rapports
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    usersCount: 0,
    syndicsCount: 0,
    immeublesCount: 0,
    revenueTotal: 0,
    recentActivity: []
  };
  
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private syndicService: SyndicService,
    private immeubleService: ImmeubleService,
    private paiementService: PaiementService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;
    
    forkJoin({
      users: this.userService.getUsersCount().pipe(catchError(() => of(0))),
      syndics: this.syndicService.getSyndicsCount().pipe(catchError(() => of(0))),
      immeubles: this.immeubleService.getImmeublesCount().pipe(catchError(() => of(0))),
      revenue: this.paiementService.getTotalRevenue().pipe(catchError(() => of(0))),
    }).pipe(
      map(results => {
        this.stats = {
          usersCount: results.users,
          syndicsCount: results.syndics,
          immeublesCount: results.immeubles,
          revenueTotal: results.revenue,
          recentActivity: this.generateMockActivity() // Pour la démonstration
        };
        this.isLoading = false;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des données du tableau de bord', error);
        this.error = 'Impossible de charger les données du tableau de bord. Veuillez réessayer plus tard.';
        this.isLoading = false;
        return of(null);
      })
    ).subscribe();
  }

  // Génère des données d'activité fictives pour la démonstration
  private generateMockActivity(): any[] {
    return [
      {
        type: 'user',
        title: 'Nouvel utilisateur',
        description: 'Ahmed Belkadi a créé un compte',
        date: new Date(2025, 2, 20)
      },
      {
        type: 'syndic',
        title: 'Nouveau syndic',
        description: 'Syndic Atlas a été ajouté au système',
        date: new Date(2025, 2, 19)
      },
      {
        type: 'immeuble',
        title: 'Nouvel immeuble',
        description: 'Résidence Andalous a été ajoutée',
        date: new Date(2025, 2, 18)
      },
      {
        type: 'payment',
        title: 'Paiement reçu',
        description: 'Paiement de 15,000 MAD reçu pour Résidence Majorelle',
        date: new Date(2025, 2, 17)
      },
      {
        type: 'system',
        title: 'Maintenance système',
        description: 'Mise à jour de la plateforme vers la version 2.1',
        date: new Date(2025, 2, 15)
      }
    ];
  }

  getActivityIconClass(type: string): string {
    switch (type) {
      case 'user':
        return 'bg-blue-100';
      case 'syndic':
        return 'bg-green-100';
      case 'immeuble':
        return 'bg-yellow-100';
      case 'payment':
        return 'bg-purple-100';
      case 'system':
        return 'bg-gray-100';
      default:
        return 'bg-gray-100';
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'user':
        return 'fas fa-user text-blue-600';
      case 'syndic':
        return 'fas fa-user-tie text-green-600';
      case 'immeuble':
        return 'fas fa-building text-yellow-600';
      case 'payment':
        return 'fas fa-money-bill-wave text-purple-600';
      case 'system':
        return 'fas fa-cog text-gray-600';
      default:
        return 'fas fa-info-circle text-gray-600';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
