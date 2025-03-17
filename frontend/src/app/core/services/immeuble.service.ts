import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {Immeuble, ImmeubleStatistics} from '../models/immeuble.model';

@Injectable({
  providedIn: 'root'
})
export class ImmeubleService {
  private apiUrl = `${environment.apiUrl}/api/immeubles`;

  constructor(private http: HttpClient) {
  }

  getAllImmeubles(): Observable<Immeuble[]> {
    return this.http.get<Immeuble[]>(this.apiUrl);
  }

  getImmeubleStatistics(): Observable<ImmeubleStatistics> {
    return this.http.get<ImmeubleStatistics>(`${this.apiUrl}/stats`);
  }

  getImmeubleById(id: number): Observable<Immeuble> {
    return this.http.get<Immeuble>(`${this.apiUrl}/${id}`);
  }

  createImmeuble(immeubleData: Partial<Immeuble>): Observable<Immeuble> {
    return this.http.post<Immeuble>(this.apiUrl, immeubleData);
  }

  updateImmeuble(id: number, immeubleData: Partial<Immeuble>): Observable<Immeuble> {
    return this.http.put<Immeuble>(`${this.apiUrl}/${id}`, immeubleData);
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
}

export class ImmeubleCreate {
}
