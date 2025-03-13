import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSyndics: number;
  totalProprietaires: number;
}

export interface SyndicStats {
  totalImmeubles: number;
  totalAppartements: number;
  totalCharges: number;
  totalPaiements: number;
}

export interface ProprietaireStats {
  mesAppartements: number;
  paiementsEnAttente: number;
  chargesImpayees: number;
  documentsDisponibles: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {
  }

  getAdminStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/stats`);
  }

  getSyndicStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/syndic/stats`);
  }

  getProprietaireStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/proprietaire/stats`);
  }
}
