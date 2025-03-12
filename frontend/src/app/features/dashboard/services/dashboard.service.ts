import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

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
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/dashboard/admin/stats`);
  }

  getSyndicStats(): Observable<SyndicStats> {
    return this.http.get<SyndicStats>(`${this.apiUrl}/dashboard/syndic/stats`);
  }

  getProprietaireStats(): Observable<ProprietaireStats> {
    return this.http.get<ProprietaireStats>(`${this.apiUrl}/dashboard/proprietaire/stats`);
  }
}
