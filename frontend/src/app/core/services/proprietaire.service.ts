import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {Proprietaire, ProprietaireStats} from '@core/models/proprietaire.model';

@Injectable({
  providedIn: 'root'
})
export class ProprietaireService {
  private apiUrl = `${environment.apiUrl}/proprietaires`;

  constructor(private http: HttpClient) {
  }

  getAllProprietaires(): Observable<Proprietaire[]> {
    return this.http.get<Proprietaire[]>(this.apiUrl);
  }

  getProprietaireById(id: number): Observable<Proprietaire> {
    return this.http.get<Proprietaire>(`${this.apiUrl}/${id}`);
  }

  createProprietaire(proprietaire: Partial<Proprietaire>): Observable<Proprietaire> {
    return this.http.post<Proprietaire>(this.apiUrl, proprietaire);
  }

  updateProprietaire(id: number, proprietaire: Partial<Proprietaire>): Observable<Proprietaire> {
    return this.http.put<Proprietaire>(`${this.apiUrl}/${id}`, proprietaire);
  }

  deleteProprietaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProprietaireStats(): Observable<ProprietaireStats> {
    return this.http.get<ProprietaireStats>(`${this.apiUrl}/stats`);
  }

  getProprietairesByVille(ville: string): Observable<Proprietaire[]> {
    return this.http.get<Proprietaire[]>(`${this.apiUrl}/ville/${ville}`);
  }

  getProprietairesByImmeuble(immeubleId: number): Observable<Proprietaire[]> {
    return this.http.get<Proprietaire[]>(`${this.apiUrl}/immeuble/${immeubleId}`);
  }

  assignerAppartement(id: number, appartementId: number): Observable<Proprietaire> {
    return this.http.post<Proprietaire>(`${this.apiUrl}/${id}/appartements/${appartementId}`, {});
  }
}
