import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

export interface ImmeubleCreate {
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  nombreEtages: number;
  nombreAppartements: number;
  anneeConstruction: number;
  syndicId: number;
}

export interface Immeuble extends ImmeubleCreate {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImmeubleService {
  private readonly API_URL = `${environment.apiUrl}/immeubles`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getImmeublesBySyndic(syndicId: number): Observable<Immeuble[]> {
    return this.http.get<Immeuble[]>(`${this.API_URL}/syndic/${syndicId}`, {
      headers: this.getHeaders()
    });
  }

  getImmeubleById(id: number): Observable<Immeuble> {
    return this.http.get<Immeuble>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    });
  }

  createImmeuble(immeuble: ImmeubleCreate): Observable<Immeuble> {
    console.log('Création immeuble avec données:', immeuble);
    console.log('Headers:', this.getHeaders().keys());
    return this.http.post<Immeuble>(this.API_URL, immeuble, {
      headers: this.getHeaders()
    });
  }

  updateImmeuble(id: number, immeuble: ImmeubleCreate): Observable<Immeuble> {
    return this.http.put<Immeuble>(`${this.API_URL}/${id}`, immeuble, {
      headers: this.getHeaders()
    });
  }

  getAllImmeubles(): Observable<Immeuble[]> {
    return this.http.get<Immeuble[]>(this.API_URL);
  }

  deleteImmeuble(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    });
  }
} 