import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NavbarComponent} from '@shared/components/navbar/navbar.component';
import {FooterComponent} from '@shared/components/footer/footer.component';
import {DocumentService} from '@core/services/document.service';
import {AuthService} from '@core/services/auth.service';
import {DocumentType, IDocument} from './models/document.model';

@Component({
  selector: 'app-mes-documents',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './mes-documents.component.html',
  styleUrls: ['./mes-documents.component.css']
})
export class MesDocumentsComponent implements OnInit {
  documents: IDocument[] = [];
  filteredDocuments: IDocument[] = [];
  documentTypes: DocumentType[] = ['CONTRAT', 'FACTURE', 'QUITTANCE', 'AUTRE'];
  selectedType: DocumentType | '' = '';
  selectedPeriod: string = '';
  uploadType: DocumentType = 'CONTRAT';
  selectedFile: File | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private documentService: DocumentService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.loadDocuments();
  }

  private loadDocuments() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.userId) {
      this.error = 'Utilisateur non connecté';
      return;
    }

    this.loading = true;
    this.error = null;

    this.documentService.getDocumentsProprietaire(currentUser.userId)
      .subscribe({
        next: (data) => {
          this.documents = data;
          this.filterDocuments();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des documents:', error);
          this.error = 'Impossible de charger vos documents. Veuillez réessayer plus tard.';
          this.loading = false;
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  uploadDocument() {
    if (!this.selectedFile) {
      this.error = 'Veuillez sélectionner un fichier';
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.userId) {
      this.error = 'Utilisateur non connecté';
      return;
    }

    this.loading = true;
    this.error = null;

    this.documentService.uploadDocument(currentUser.userId, this.selectedFile, this.uploadType)
      .subscribe({
        next: () => {
          this.loadDocuments();
          this.selectedFile = null;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du téléversement:', error);
          this.error = 'Impossible de téléverser le document. Veuillez réessayer plus tard.';
          this.loading = false;
        }
      });
  }

  downloadDocument(doc: IDocument) {
    this.loading = true;
    this.error = null;

    this.documentService.downloadDocument(doc.id)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = window.document.createElement('a');
          a.href = url;
          a.download = doc.nom;
          window.document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          window.document.body.removeChild(a);
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du téléchargement:', error);
          this.error = 'Impossible de télécharger le document. Veuillez réessayer plus tard.';
          this.loading = false;
        }
      });
  }

  previewDocument(doc: IDocument) {
    this.loading = true;
    this.error = null;

    this.documentService.downloadDocument(doc.id)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          window.URL.revokeObjectURL(url);
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors de l\'aperçu:', error);
          this.error = 'Impossible d\'afficher l\'aperçu du document. Veuillez réessayer plus tard.';
          this.loading = false;
        }
      });
  }

  getDocumentTypeStyles(type: DocumentType): { bgColor: string; textColor: string } {
    switch (type) {
      case 'CONTRAT':
        return {bgColor: 'bg-green-100', textColor: 'text-green-600'};
      case 'FACTURE':
        return {bgColor: 'bg-yellow-100', textColor: 'text-yellow-600'};
      case 'QUITTANCE':
        return {bgColor: 'bg-indigo-100', textColor: 'text-indigo-600'};
      default:
        return {bgColor: 'bg-gray-100', textColor: 'text-gray-600'};
    }
  }
}
