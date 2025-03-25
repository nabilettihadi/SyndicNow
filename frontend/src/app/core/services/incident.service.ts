import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable, catchError, throwError} from 'rxjs';
import {environment} from '@env/environment';
import {addStatusAlias, Incident, IncidentWithStatus} from '@core/models/incident.model';
import {AuthService} from '@core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = `${environment.apiUrl}/api/incidents`;

  constructor(private http: HttpClient, private authService: AuthService) {
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

  deleteIncident(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    console.log(`Demande de suppression de l'incident ${id} à l'URL ${url}`);
    
    const currentUser = this.authService.getCurrentUser();
    
    const params = currentUser?.userId ? 
      { params: new HttpParams().set('userId', currentUser.userId.toString()) } : 
      {};
      
    return this.http.delete(url, params).pipe(
      catchError(error => {
        console.error(`Erreur lors de la suppression de l'incident ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  updateIncidentStatus(id: number, statut: string): Observable<IncidentWithStatus> {
    console.log(`Mise à jour du statut de l'incident ${id} vers ${statut}`);
    
    return this.http.patch<Incident>(`${this.apiUrl}/${id}/status?status=${statut}`, {}).pipe(
      map(incident => addStatusAlias(incident)),
      catchError(error => {
        console.error(`Erreur lors de la mise à jour du statut de l'incident ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  getIncidentsByProprietaire(proprietaireId: number): Observable<IncidentWithStatus[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/proprietaire/${proprietaireId}`).pipe(
      map(incidents => incidents.map(incident => addStatusAlias(incident)))
    );
  }
}
