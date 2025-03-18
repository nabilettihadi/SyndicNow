import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Syndic } from '../models/syndic.model';

@Injectable({
  providedIn: 'root'
})
export class SyndicService {
  private apiUrl = `${environment.apiUrl}/api/v1/syndics`;

  constructor(private http: HttpClient) {}

  getAllSyndics(): Observable<Syndic[]> {
    return this.http.get<Syndic[]>(this.apiUrl);
  }

  getSyndicById(id: number): Observable<Syndic> {
    return this.http.get<Syndic>(`${this.apiUrl}/${id}`);
  }

  getSyndicsByImmeuble(immeubleId: number): Observable<Syndic[]> {
    return this.http.get<Syndic[]>(`${this.apiUrl}/immeuble/${immeubleId}`);
  }

  createSyndic(syndic: Syndic): Observable<Syndic> {
    return this.http.post<Syndic>(this.apiUrl, syndic);
  }

  updateSyndic(id: number, syndic: Syndic): Observable<Syndic> {
    return this.http.put<Syndic>(`${this.apiUrl}/${id}`, syndic);
  }

  deleteSyndic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignerImmeuble(id: number, immeubleId: number): Observable<Syndic> {
    return this.http.post<Syndic>(`${this.apiUrl}/${id}/immeubles`, { immeubleId });
  }

  retirerImmeuble(id: number, immeubleId: number): Observable<Syndic> {
    return this.http.delete<Syndic>(`${this.apiUrl}/${id}/immeubles/${immeubleId}`);
  }

  terminerMandat(id: number, dateFin: Date): Observable<Syndic> {
    return this.http.patch<Syndic>(`${this.apiUrl}/${id}/fin-mandat`, { dateFin });
  }

  ajouterDocument(id: number, file: File): Observable<Syndic> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Syndic>(`${this.apiUrl}/${id}/documents`, formData);
  }

  supprimerDocument(id: number, documentId: number): Observable<Syndic> {
    return this.http.delete<Syndic>(`${this.apiUrl}/${id}/documents/${documentId}`);
  }
} 