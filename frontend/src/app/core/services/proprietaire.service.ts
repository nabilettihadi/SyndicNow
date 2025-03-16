import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Proprietaire, ProprietaireStatistics } from '../models/proprietaire.model';

@Injectable({
  providedIn: 'root'
})
export class ProprietaireService {
  private apiUrl = `${environment.apiUrl}/api/proprietaires`;

  constructor(private http: HttpClient) {}

  getAllProprietaires(): Observable<Proprietaire[]> {
    return this.http.get<Proprietaire[]>(this.apiUrl);
  }

  getProprietaireById(id: number): Observable<Proprietaire> {
    return this.http.get<Proprietaire>(`${this.apiUrl}/${id}`);
  }

  createProprietaire(proprietaireData: Partial<Proprietaire>): Observable<Proprietaire> {
    return this.http.post<Proprietaire>(this.apiUrl, proprietaireData);
  }

  updateProprietaire(id: number, proprietaireData: Partial<Proprietaire>): Observable<Proprietaire> {
    return this.http.put<Proprietaire>(`${this.apiUrl}/${id}`, proprietaireData);
  }

  deleteProprietaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProprietairesByImmeuble(immeubleId: number): Observable<Proprietaire[]> {
    return this.http.get<Proprietaire[]>(`${this.apiUrl}/immeuble/${immeubleId}`);
  }

  getProprietaireStatistics(): Observable<ProprietaireStatistics> {
    return this.http.get<ProprietaireStatistics>(`${this.apiUrl}/statistics`);
  }

  assignAppartementToProprietaire(proprietaireId: number, appartementId: number): Observable<Proprietaire> {
    return this.http.post<Proprietaire>(`${this.apiUrl}/${proprietaireId}/appartements/${appartementId}`, {});
  }

  removeAppartementFromProprietaire(proprietaireId: number, appartementId: number): Observable<Proprietaire> {
    return this.http.delete<Proprietaire>(`${this.apiUrl}/${proprietaireId}/appartements/${appartementId}`);
  }
} 