import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '@env/environment';
import {Appartement, AppartementDetails, AppartementStats} from '../models/appartement.model';

@Injectable({
  providedIn: 'root'
})
export class AppartementService {
  private apiUrl = `${environment.apiUrl}/api/appartements`;

  constructor(private http: HttpClient) {
  }

  getAllAppartements(): Observable<Appartement[]> {
    return this.http.get<Appartement[]>(this.apiUrl);
  }

  getAllAppartementsDetails(): Observable<AppartementDetails[]> {
    return this.http.get<AppartementDetails[]>(`${this.apiUrl}/details`).pipe(
      catchError(this.handleError)
    );
  }

  getAppartementById(id: number): Observable<AppartementDetails> {
    return this.http.get<AppartementDetails>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération:', error);
        return this.handleError(error);
      })
    );
  }

  createAppartement(appartement: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, appartement);
  }

  createAppartementForProprietaire(proprietaireId: number, appartement: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/proprietaire/${proprietaireId}`, appartement);
  }

  updateAppartement(id: number, appartement: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, appartement).pipe(
      catchError((error) => {
        console.error('Erreur lors de la mise à jour:', error);
        return this.handleError(error);
      })
    );
  }

  deleteAppartement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAppartementStats(): Observable<AppartementStats> {
    return this.http.get<AppartementStats>(`${this.apiUrl}/stats`);
  }

  getAppartementsByImmeuble(immeubleId: number): Observable<Appartement[]> {
    return this.http.get<Appartement[]>(`${this.apiUrl}/immeuble/${immeubleId}`);
  }

  getAppartementsByProprietaire(proprietaireId: number): Observable<Appartement[]> {
    return this.http.get<Appartement[]>(`${this.apiUrl}/proprietaire/${proprietaireId}`);
  }

  getAppartementsBySyndic(syndicId: number): Observable<Appartement[]> {
    return this.http.get<Appartement[]>(`${this.apiUrl}/syndic/${syndicId}`);
  }

  getAppartementsByStatus(status: string): Observable<Appartement[]> {
    return this.http.get<Appartement[]>(`${this.apiUrl}/status/${status}`);
  }

  assignerProprietaire(id: number, proprietaireId: number): Observable<Appartement> {
    return this.http.post<Appartement>(`${this.apiUrl}/${id}/proprietaire/${proprietaireId}`, {});
  }

  getAppartementsProprietaire(proprietaireId: number): Observable<AppartementDetails[]> {
    console.log('Appel API pour proprietaire:', proprietaireId);
    return this.http.get<any[]>(`${this.apiUrl}/proprietaire/${proprietaireId}`).pipe(
      map(appartements => {
        console.log('Réponse API brute:', appartements);
        return appartements.map(app => {
          console.log('Mapping appartement:', app);
          return {
            ...app,
            surface: app.surface || 0,
            nombrePieces: app.nombrePieces || 0,
            immeuble: {
              id: app.immeubleId,
              nom: app.immeubleName,
              adresse: app.immeubleAdresse,
              ville: app.immeubleVille,
              syndic: app.syndicId ? {
                id: Number(app.syndicId), // Conversion explicite en nombre
                nom: app.syndicName,
                email: app.syndicEmail
              } : null
            }
          };
        });
      }),
      catchError((error) => {
        console.error('Erreur dans le service:', error);
        return this.handleError(error);
      })
    );
  }

  getAppartementDetails(id: number): Observable<AppartementDetails> {
    return this.http.get<AppartementDetails>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteAppartementForProprietaire(proprietaireId: number, appartementId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/proprietaire/${proprietaireId}/${appartementId}`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    console.error('AppartementService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
