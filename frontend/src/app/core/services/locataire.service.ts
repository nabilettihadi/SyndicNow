import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Locataire } from '../models/locataire.model';

@Injectable({
  providedIn: 'root'
})
export class LocataireService {
  private apiUrl = `${environment.apiUrl}/api/v1/locataires`;

  constructor(private http: HttpClient) {}

  getAllLocataires(): Observable<Locataire[]> {
    return this.http.get<Locataire[]>(this.apiUrl);
  }

  getLocataireById(id: number): Observable<Locataire> {
    return this.http.get<Locataire>(`${this.apiUrl}/${id}`);
  }

  getLocatairesByAppartement(appartementId: number): Observable<Locataire[]> {
    return this.http.get<Locataire[]>(`${this.apiUrl}/appartement/${appartementId}`);
  }

  getLocatairesByImmeuble(immeubleId: number): Observable<Locataire[]> {
    return this.http.get<Locataire[]>(`${this.apiUrl}/immeuble/${immeubleId}`);
  }

  createLocataire(locataire: Locataire): Observable<Locataire> {
    return this.http.post<Locataire>(this.apiUrl, locataire);
  }

  updateLocataire(id: number, locataire: Locataire): Observable<Locataire> {
    return this.http.put<Locataire>(`${this.apiUrl}/${id}`, locataire);
  }

  deleteLocataire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  terminerBail(id: number, dateFin: Date): Observable<Locataire> {
    return this.http.patch<Locataire>(`${this.apiUrl}/${id}/fin-bail`, { dateFin });
  }
} 