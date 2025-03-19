import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Incident } from '../models/incident.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = `${environment.apiUrl}/incidents`;

  constructor(private http: HttpClient) {}

  getAllIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.apiUrl);
  }

  getIncidentById(id: number): Observable<Incident> {
    return this.http.get<Incident>(`${this.apiUrl}/${id}`);
  }

  getIncidentsByImmeuble(immeubleId: number): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/immeuble/${immeubleId}`);
  }

  createIncident(incident: Incident): Observable<Incident> {
    return this.http.post<Incident>(this.apiUrl, incident);
  }

  updateIncident(id: number, incident: Incident): Observable<Incident> {
    return this.http.put<Incident>(`${this.apiUrl}/${id}`, incident);
  }

  deleteIncident(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateIncidentStatus(id: number, statut: string): Observable<Incident> {
    return this.http.patch<Incident>(`${this.apiUrl}/${id}/statut`, { statut });
  }

  getIncidentsByProprietaire(proprietaireId: number): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/proprietaire/${proprietaireId}`);
  }
} 