import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { DocumentService } from '../../../core/services/document.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mes-documents',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar></app-navbar>
      <div class="container mx-auto px-4 py-8 flex-grow">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Mes Documents</h1>

        <!-- Filtres -->
        <div class="mb-6 flex gap-4">
          <select [(ngModel)]="selectedType" (change)="filterDocuments()" class="form-select rounded-md border-gray-300">
            <option value="">Tous les types</option>
            <option value="CONTRAT">Contrats</option>
            <option value="FACTURE">Factures</option>
            <option value="QUITTANCE">Quittances</option>
            <option value="AUTRE">Autres</option>
          </select>
          <input type="month" [(ngModel)]="selectedPeriod" (change)="filterDocuments()" class="form-input rounded-md border-gray-300">
        </div>

        <!-- Upload de document -->
        <div class="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Ajouter un document</h3>
          <div class="flex gap-4">
            <input type="file" (change)="onFileSelected($event)" class="form-input rounded-md border-gray-300">
            <select [(ngModel)]="uploadType" class="form-select rounded-md border-gray-300">
              <option value="CONTRAT">Contrat</option>
              <option value="FACTURE">Facture</option>
              <option value="QUITTANCE">Quittance</option>
              <option value="AUTRE">Autre</option>
            </select>
            <button (click)="uploadDocument()" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Téléverser
            </button>
          </div>
        </div>

        <!-- Liste des documents -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let document of filteredDocuments" class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center mb-4">
              <div class="p-3 rounded-lg" [ngClass]="{
                'bg-indigo-100': document.type === 'QUITTANCE',
                'bg-green-100': document.type === 'CONTRAT',
                'bg-yellow-100': document.type === 'FACTURE',
                'bg-gray-100': document.type === 'AUTRE'
              }">
                <svg class="h-6 w-6" [ngClass]="{
                  'text-indigo-600': document.type === 'QUITTANCE',
                  'text-green-600': document.type === 'CONTRAT',
                  'text-yellow-600': document.type === 'FACTURE',
                  'text-gray-600': document.type === 'AUTRE'
                }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">{{document.nom}}</h3>
                <p class="text-sm text-gray-500">{{document.date | date:'MMMM yyyy'}}</p>
              </div>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500">{{document.type}} - {{document.taille | number:'1.0-0'}} Ko</span>
              <div class="flex space-x-3">
                <button (click)="previewDocument(document)" class="text-indigo-600 hover:text-indigo-900">Aperçu</button>
                <button (click)="downloadDocument(document)" class="text-blue-600 hover:text-blue-900">Télécharger</button>
              </div>
            </div>
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
export class MesDocumentsComponent implements OnInit {
  documents: any[] = [];
  filteredDocuments: any[] = [];
  selectedType: string = '';
  selectedPeriod: string = '';
  uploadType: string = 'CONTRAT';
  selectedFile: File | null = null;

  constructor(
    private documentService: DocumentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userId = this.authService.getCurrentUser()?.userId;
    if (userId) {
      this.loadDocuments(userId);
    }
  }

  loadDocuments(userId: number) {
    this.documentService.getDocumentsProprietaire(userId)
      .subscribe({
        next: (data) => {
          this.documents = data;
          this.filterDocuments();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des documents:', error);
        }
      });
  }

  filterDocuments() {
    this.filteredDocuments = this.documents.filter(doc => {
      const typeMatch = !this.selectedType || doc.type === this.selectedType;
      const periodMatch = !this.selectedPeriod || 
        new Date(doc.date).toISOString().substring(0, 7) === this.selectedPeriod;
      return typeMatch && periodMatch;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadDocument() {
    if (!this.selectedFile) return;
    
    const userId = this.authService.getCurrentUser()?.userId;
    if (userId) {
      this.documentService.uploadDocument(userId, this.selectedFile, this.uploadType)
        .subscribe({
          next: () => {
            this.loadDocuments(userId);
            this.selectedFile = null;
          },
          error: (error) => {
            console.error('Erreur lors du téléversement:', error);
          }
        });
    }
  }

  downloadDocument(document: any) {
    this.documentService.downloadDocument(document.id)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = document.nom;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        error: (error) => {
          console.error('Erreur lors du téléchargement:', error);
        }
      });
  }

  previewDocument(document: any) {
    this.documentService.downloadDocument(document.id)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Erreur lors de l\'aperçu:', error);
        }
      });
  }
} 