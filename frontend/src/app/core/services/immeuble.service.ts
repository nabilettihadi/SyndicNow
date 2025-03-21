import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {Immeuble, ImmeubleStats} from '@core/models/immeuble.model';

@Injectable({
  providedIn: 'root'
})
export class ImmeubleService {
  private apiUrl = `${environment.apiUrl}/api/v1/immeubles`;

  constructor(private http: HttpClient) {
  }

  getAllImmeubles(): Observable<Immeuble[]> {
    return this.http.get<Immeuble[]>(this.apiUrl);
  }

  getImmeubleStats(): Observable<ImmeubleStats> {
    return this.http.get<ImmeubleStats>(`${this.apiUrl}/stats`);
  }

  getImmeubleById(id: number): Observable<Immeuble> {
    return this.http.get<Immeuble>(`${this.apiUrl}/${id}`);
  }

  createImmeuble(immeuble: Partial<Immeuble>): Observable<Immeuble> {
    return this.http.post<Immeuble>(this.apiUrl, immeuble);
  }

  updateImmeuble(id: number, immeuble: Partial<Immeuble>): Observable<Immeuble> {
    return this.http.put<Immeuble>(`${this.apiUrl}/${id}`, immeuble);
  }

  deleteImmeuble(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getImmeublesByRegion(region: string): Observable<Immeuble[]> {
    return this.http.get<Immeuble[]>(`${this.apiUrl}/region/${region}`);
  }

  getImmeublesBySyndic(syndicId: number): Observable<Immeuble[]> {
    return this.http.get<Immeuble[]>(`${this.apiUrl}/syndic/${syndicId}`);
  }

  getAllImmeublesBySyndic(): Observable<Immeuble[]> {
    return this.http.get<Immeuble[]>(`${this.apiUrl}/syndic`);
  }

  getImmeublesByVille(ville: string): Observable<Immeuble[]> {
    return this.http.get<Immeuble[]>(`${this.apiUrl}/ville/${ville}`);
  }

  getAppartementsByImmeuble(immeubleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${immeubleId}/appartements`);
  }
}

export class ImmeubleCreate {
}
