import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '@env/environment';
import {Proprietaire, ProprietaireStats} from '@core/models/proprietaire.model';

@Injectable({
  providedIn: 'root'
})
export class ProprietaireService {
  private apiUrl = `${environment.apiUrl}/api/proprietaires`;

  constructor(private http: HttpClient) {
  }

  getAllProprietaires(): Observable<Proprietaire[]> {
    return this.http.get<Proprietaire[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getProprietaireById(id: number): Observable<Proprietaire> {
    return this.http.get<Proprietaire>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createProprietaire(proprietaire: Partial<Proprietaire>): Observable<Proprietaire> {
    return this.http.post<Proprietaire>(this.apiUrl, proprietaire)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateProprietaire(id: number, proprietaire: Partial<Proprietaire>): Observable<Proprietaire> {
    return this.http.put<Proprietaire>(`${this.apiUrl}/${id}`, proprietaire)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteProprietaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getProprietaireStats(): Observable<ProprietaireStats> {
    return this.http.get<ProprietaireStats>(`${this.apiUrl}/stats`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getProprietairesByVille(ville: string): Observable<Proprietaire[]> {
    return this.http.get<Proprietaire[]>(`${this.apiUrl}/ville/${ville}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getProprietairesByImmeuble(immeubleId: number): Observable<Proprietaire[]> {
    return this.http.get<Proprietaire[]>(`${this.apiUrl}/immeuble/${immeubleId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  assignerAppartement(id: number, appartementId: number): Observable<Proprietaire> {
    return this.http.post<Proprietaire>(`${this.apiUrl}/${id}/appartements/${appartementId}`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Une erreur est survenue:', error);
    return throwError(() => error);
  }
}
