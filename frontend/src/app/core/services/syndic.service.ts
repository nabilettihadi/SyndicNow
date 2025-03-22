import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, catchError, throwError} from 'rxjs';
import {environment} from '@env/environment';
import {Syndic, SyndicStats} from '@core/models/syndic.model';

@Injectable({
  providedIn: 'root'
})
export class SyndicService {
  private apiUrl = environment.apiUrl + '/syndics';

  constructor(private http: HttpClient) {
  }

  // Récupérer tous les syndics
  getAllSyndics(): Observable<Syndic[]> {
    return this.http.get<Syndic[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Récupérer un syndic par son ID
  getSyndicById(id: number): Observable<Syndic> {
    return this.http.get<Syndic>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Créer un nouveau syndic
  createSyndic(syndic: Syndic): Observable<Syndic> {
    return this.http.post<Syndic>(this.apiUrl, syndic)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Mettre à jour un syndic
  updateSyndic(id: number, syndic: Syndic): Observable<Syndic> {
    return this.http.put<Syndic>(`${this.apiUrl}/${id}`, syndic)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Supprimer un syndic
  deleteSyndic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Récupérer les statistiques des syndics
  getSyndicStats(): Observable<SyndicStats> {
    return this.http.get<SyndicStats>(`${this.apiUrl}/stats`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Récupérer les syndics par ville
  getSyndicsByCity(city: string): Observable<Syndic[]> {
    return this.http.get<Syndic[]>(`${this.apiUrl}/city/${city}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Récupérer les syndics par statut
  getSyndicsByStatus(status: string): Observable<Syndic[]> {
    return this.http.get<Syndic[]>(`${this.apiUrl}/status/${status}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Récupérer les syndics par immeuble
  getSyndicsByImmeuble(immeubleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/immeuble/${immeubleId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Assigner un immeuble à un syndic
  assignImmeubleToSyndic(syndicId: number, immeubleId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${syndicId}/immeubles/${immeubleId}`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  // Retirer un immeuble d'un syndic
  removeImmeubleFromSyndic(syndicId: number, immeubleId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${syndicId}/immeubles/${immeubleId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Terminer le mandat d'un syndic
  terminerMandat(id: number, dateFin: Date): Observable<Syndic> {
    return this.http.post<Syndic>(`${this.apiUrl}/${id}/terminer`, { dateFin })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Ajouter un document à un syndic
  ajouterDocument(id: number, file: File): Observable<Syndic> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<Syndic>(`${this.apiUrl}/${id}/documents`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Supprimer un document d'un syndic
  supprimerDocument(id: number, documentId: number): Observable<Syndic> {
    return this.http.delete<Syndic>(`${this.apiUrl}/${id}/documents/${documentId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Une erreur est survenue:', error);
    return throwError(() => error);
  }
}
