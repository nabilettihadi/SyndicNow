import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {environment} from '@env/environment';
import {Syndic, SyndicStats} from '@core/models/syndic.model';

@Injectable({
  providedIn: 'root'
})
export class SyndicService {
  private apiUrl = `${environment.apiUrl}/api/syndics`;

  constructor(private http: HttpClient) {
  }

  // Récupérer tous les syndics
  getAllSyndics(): Observable<Syndic[]> {
    console.log('Appel API getAllSyndics:', this.apiUrl);
    return this.http.get<Syndic[]>(this.apiUrl)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Erreur lors de la récupération des syndics:', error);
          if (error.status === 401) {
            return throwError(() => new Error('Non autorisé. Veuillez vous connecter.'));
          }
          if (error.status === 404) {
            return throwError(() => new Error('Le service des syndics n\'est pas disponible.'));
          }
          if (error.status === 500) {
            console.error('Erreur serveur détaillée:', error.error);
            return throwError(() => new Error('Erreur serveur: ' + (error.error?.message || 'Une erreur interne est survenue')));
          }
          return throwError(() => new Error('Une erreur est survenue lors de la récupération des syndics.'));
        })
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
    return this.http.get<any[]>(`${this.apiUrl}/immeubles/${immeubleId}`)
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
    return this.http.post<Syndic>(`${this.apiUrl}/${id}/terminer`, {dateFin})
      .pipe(
        catchError(this.handleError)
      );
  }

  // Supprimer un appartement d'un immeuble
  supprimerAppartement(id: number, appartementId: number): Observable<Syndic> {
    return this.http.delete<Syndic>(`${this.apiUrl}/${id}/appartements/${appartementId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Mettre à jour le profil d'un syndic
  updateProfil(id: number, data: Partial<Syndic>): Observable<Syndic> {
    return this.http.put<Syndic>(`${this.apiUrl}/${id}/profil`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Gérer les erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = error.error.message;
    } else {
      // Erreur côté serveur
      errorMessage = error.error?.message || error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
