import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppartementService {
  private apiUrl = `${environment.apiUrl}/api/appartements`;

  constructor(private http: HttpClient) {}

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