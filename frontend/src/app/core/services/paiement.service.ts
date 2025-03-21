import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
  private apiUrl = `${environment.apiUrl}/api/v1/paiements`;

  constructor(private http: HttpClient) {
  }

  getAllPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(this.apiUrl);
  }

  getPaiementById(id: number): Observable<Paiement> {
    return this.http.get<Paiement>(`${this.apiUrl}/${id}`);
  }

  createPaiement(paiement: Partial<Paiement>): Observable<Paiement> {
    return this.http.post<Paiement>(this.apiUrl, paiement);
  }

  updatePaiement(id: number, paiement: Partial<Paiement>): Observable<Paiement> {
    return this.http.put<Paiement>(`${this.apiUrl}/${id}`, paiement);
  }

  deletePaiement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPaiementsByProprietaire(proprietaireId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/proprietaire/${proprietaireId}`);
  }

  getPaiementsBySyndic(syndicId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/syndic/${syndicId}`);
  }

  getPaiementsByAppartement(appartementId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/appartement/${appartementId}`);
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

  getAllPaiementsByStatus(status: string): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/status/${status}`);
  }

  getPaymentStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }
}
