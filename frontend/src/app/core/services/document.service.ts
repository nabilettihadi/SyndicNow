import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/api/v1/documents`;

  constructor(private http: HttpClient) {}

  getDocumentsProprietaire(proprietaireId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/proprietaire/${proprietaireId}`);
  }

  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  uploadDocument(proprietaireId: number, file: File, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return this.http.post(`${this.apiUrl}/proprietaire/${proprietaireId}/upload`, formData);
  }
} 