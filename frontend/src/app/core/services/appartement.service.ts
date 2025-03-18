import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '@env/environment';
import {Appartement} from '../models/appartement.model';

@Injectable({
  providedIn: 'root'
})
export class AppartementService {
  private apiUrl = `${environment.apiUrl}/appartements`;

  constructor(private http: HttpClient) {
  }

  getAllAppartements(): Observable<Appartement[]> {
    return this.http.get<Appartement[]>(this.apiUrl);
  }

  getAppartementById(id: number): Observable<Appartement> {
    return this.http.get<Appartement>(`${this.apiUrl}/${id}`);
  }

  createAppartement(appartement: Partial<Appartement>): Observable<Appartement> {
    return this.http.post<Appartement>(this.apiUrl, appartement);
  }

  updateAppartement(id: number, appartement: Partial<Appartement>): Observable<Appartement> {
    return this.http.put<Appartement>(`${this.apiUrl}/${id}`, appartement);
  }

  deleteAppartement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAppartementsProprietaire(proprietaireId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/proprietaire/${proprietaireId}`).pipe(
      catchError(this.handleError)
    );
  }

  getAppartementDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
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
