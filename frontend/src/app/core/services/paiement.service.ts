import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {Paiement, PaiementStatistics} from '../models/paiement.model';

export interface StripePaymentRequest {
  paiementId: number;
  amount: number;
  description: string;
  customerEmail: string;
}

export interface StripePaymentResponse {
  sessionId: string;
  checkoutUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = `${environment.apiUrl}/paiements`;

  constructor(private http: HttpClient) {
  }

  getAllPaiements(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPaiementById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPaiement(paiement: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, paiement);
  }

  updatePaiement(id: number, paiement: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, paiement);
  }

  deletePaiement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPaiementsByImmeuble(immeubleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/immeuble/${immeubleId}`);
  }

  getPaiementsByAppartement(appartementId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appartement/${appartementId}`);
  }

  getPaiementsByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/status/${status}`);
  }

  getPaiementsByPeriod(startDate: string, endDate: string): Observable<any[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<any[]>(`${this.apiUrl}/period`, { params });
  }

  getPaiementsByProprietaire(proprietaireId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/proprietaire/${proprietaireId}`);
  }

  getPaiementsBySyndic(syndicId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/syndic/${syndicId}`);
  }

  getPaiementStatistics(): Observable<PaiementStatistics> {
    return this.http.get<PaiementStatistics>(`${this.apiUrl}/statistics`);
  }

  validatePaiement(id: number): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}/${id}/validate`, {});
  }

  rejectPaiement(id: number, reason: string): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}/${id}/reject`, {reason});
  }

  downloadRecu(paiementId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${paiementId}/recu`, {responseType: 'blob'});
  }

  createStripeCheckoutSession(paymentRequest: StripePaymentRequest): Observable<StripePaymentResponse> {
    return this.http.post<StripePaymentResponse>(`${this.apiUrl}/create-checkout-session`, paymentRequest);
  }

  verifyPaymentStatus(sessionId: string): Observable<{ status: string, paiementId: number }> {
    return this.http.get<{ status: string, paiementId: number }>(`${this.apiUrl}/verify-payment/${sessionId}`);
  }

  getPaymentStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }
}
