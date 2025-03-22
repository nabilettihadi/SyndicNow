import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {Document} from '@core/models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {
  }

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl);
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/${id}`);
  }

  getDocumentsBySyndic(syndicId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/syndic/${syndicId}`);
  }

  getDocumentsByImmeuble(immeubleId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/immeuble/${immeubleId}`);
  }

  getDocumentsByAppartement(appartementId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/appartement/${appartementId}`);
  }

  getDocumentsProprietaire(proprietaireId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/proprietaire/${proprietaireId}`);
  }

  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, {responseType: 'blob'});
  }

  uploadDocument(file: File, metadata: Partial<Document>): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    return this.http.post<Document>(`${this.apiUrl}/upload`, formData);
  }

  uploadDocumentForProprietaire(proprietaireId: number, file: File, type: string): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return this.http.post<Document>(`${this.apiUrl}/proprietaire/${proprietaireId}/upload`, formData);
  }

  uploadDocumentForImmeuble(immeubleId: number, file: File, metadata: Partial<Document>): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    return this.http.post<Document>(`${this.apiUrl}/immeuble/${immeubleId}/upload`, formData);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateDocument(id: number, metadata: Partial<Document>): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/${id}`, metadata);
  }
}
