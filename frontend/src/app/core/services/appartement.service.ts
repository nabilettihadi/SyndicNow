import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
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

  getAppartementById(id: number): Observable<Appartement> {
    return this.http.get<Appartement>(`${this.apiUrl}/${id}`);
  }

  createAppartement(appartement: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, appartement);
  }

  createAppartementForProprietaire(proprietaireId: number, appartement: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/proprietaire/${proprietaireId}`, appartement);
  }

  updateAppartement(id: number, appartement: Partial<Appartement>): Observable<Appartement> {
    return this.http.put<Appartement>(`${this.apiUrl}/${id}`, appartement);
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
    return this.http.get<AppartementDetails[]>(`${this.apiUrl}/proprietaire/${proprietaireId}`).pipe(
      catchError(this.handleError)
    );
  }

  getAppartementDetails(id: number): Observable<AppartementDetails> {
    return this.http.get<AppartementDetails>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
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
