import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '@core/services/document.service';
import { Document as AppDocument } from '@core/models/document.model';

@Component({
  selector: 'app-list-documents',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-documents.component.html',
  styleUrls: []
})
export class ListDocumentsComponent implements OnInit {
  syndicId: number = 1; // À remplacer par l'ID du syndic actuel
  isLoading = true;
  hasError = false;
  errorMessage = '';
  
  documents: AppDocument[] = [];
  filteredDocuments: AppDocument[] = [];
  searchTerm: string = '';
  typeFilter: string = 'ALL';
  selectedDocument: AppDocument | null = null;
  isUploadModalOpen = false;
  uploadFile: File | null = null;
  uploadProgress = 0;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getDocumentsBySyndic(this.syndicId).subscribe({
      next: (data) => {
        this.documents = data;
        this.filteredDocuments = [...this.documents];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des documents:', error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage = 'Une erreur est survenue lors du chargement des documents';
      }
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim() && this.typeFilter === 'ALL') {
      this.filteredDocuments = [...this.documents];
      return;
    }
    
    let filtered = [...this.documents];
    
    // Filtre par type
    if (this.typeFilter !== 'ALL') {
      filtered = filtered.filter(document => document.type === this.typeFilter);
    }
    
    // Filtre par texte de recherche
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(document => 
        document.nom.toLowerCase().includes(searchLower) || 
        document.description.toLowerCase().includes(searchLower) ||
        (document.immeuble?.nom.toLowerCase() || '').includes(searchLower) ||
        (document.tags?.some(tag => tag.toLowerCase().includes(searchLower)) || false)
      );
    }
    
    this.filteredDocuments = filtered;
  }

  getDocumentsByType(type: string): number {
    return this.documents.filter(document => document.type === type).length;
  }

  getDocumentTypeClass(type: string): string {
    switch (type) {
      case 'CONTRAT':
        return 'bg-blue-100 text-blue-800';
      case 'FACTURE':
        return 'bg-green-100 text-green-800';
      case 'REGLEMENT':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getDocumentIcon(format: string): string {
    switch (format.toLowerCase()) {
      case 'pdf':
        return 'fas fa-file-pdf text-red-500';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word text-blue-500';
      case 'xls':
      case 'xlsx':
        return 'fas fa-file-excel text-green-500';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'fas fa-file-image text-purple-500';
      default:
        return 'fas fa-file text-gray-500';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadDocument(doc: AppDocument): void {
    this.documentService.downloadDocument(doc.id!).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = doc.nom;
        window.document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement du document:', error);
        this.errorMessage = 'Erreur lors du téléchargement du document';
      }
    });
  }

  openUploadModal(): void {
    this.isUploadModalOpen = true;
    this.uploadFile = null;
    this.uploadProgress = 0;
  }

  closeUploadModal(): void {
    this.isUploadModalOpen = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile = input.files[0];
    }
  }

  uploadDocument(metadata: any): void {
    if (!this.uploadFile) return;
    
    // Simuler une progression de téléchargement
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        
        // Appel réel au service
        this.documentService.uploadDocument(this.uploadFile!, metadata).subscribe({
          next: () => {
            this.loadDocuments();
            this.closeUploadModal();
          },
          error: (error) => {
            console.error('Erreur lors du téléchargement du document:', error);
            this.errorMessage = 'Erreur lors du téléchargement du document';
          }
        });
      }
    }, 300);
  }

  deleteDocument(doc: AppDocument): void {
    if (confirm(`Voulez-vous vraiment supprimer le document "${doc.nom}" ?`)) {
      this.documentService.deleteDocument(doc.id!).subscribe({
        next: () => {
          this.loadDocuments();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du document:', error);
          this.errorMessage = 'Erreur lors de la suppression du document';
        }
      });
    }
  }

  viewDocumentDetails(doc: AppDocument): void {
    this.selectedDocument = doc;
  }

  closeDocumentDetails(): void {
    this.selectedDocument = null;
  }
} 