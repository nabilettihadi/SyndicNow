import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from '@env/environment';
import {addStatusAlias, Incident, IncidentWithStatus} from '@core/models/incident.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = `${environment.apiUrl}/api/incidents`;

  constructor(private http: HttpClient) {
  }

  getAllIncidents(): Observable<IncidentWithStatus[]> {
    return this.http.get<Incident[]>(this.apiUrl).pipe(
      map(incidents => incidents.map(incident => addStatusAlias(incident)))
    );
  }

  getIncidentById(id: number): Observable<IncidentWithStatus> {
    return this.http.get<Incident>(`${this.apiUrl}/${id}`).pipe(
      map(incident => addStatusAlias(incident))
    );
  }

  getIncidentsByImmeuble(immeubleId: number): Observable<IncidentWithStatus[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/immeuble/${immeubleId}`).pipe(
      map(incidents => incidents.map(incident => addStatusAlias(incident)))
    );
  }

  getIncidentsBySyndic(syndicId: number): Observable<IncidentWithStatus[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/syndic/${syndicId}`).pipe(
      map(incidents => incidents.map(incident => addStatusAlias(incident)))
    );
  }

  createIncident(incident: Incident): Observable<IncidentWithStatus> {
    return this.http.post<Incident>(this.apiUrl, incident).pipe(
      map(incident => addStatusAlias(incident))
    );
  }

  updateIncident(id: number, incident: Partial<Incident>): Observable<IncidentWithStatus> {
    return this.http.put<Incident>(`${this.apiUrl}/${id}`, incident).pipe(
      map(incident => addStatusAlias(incident))
    );
  }

  deleteIncident(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateIncidentStatus(id: number, statut: string): Observable<IncidentWithStatus> {
    return this.http.put<Incident>(`${this.apiUrl}/${id}/statut`, {statut}).pipe(
      map(incident => addStatusAlias(incident))
    );
  }

  getIncidentsByProprietaire(proprietaireId: number): Observable<IncidentWithStatus[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/proprietaire/${proprietaireId}`).pipe(
      map(incidents => incidents.map(incident => addStatusAlias(incident)))
    );
  }
}
