import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface ReportStats {
  totalUsers: number;
  totalPayments: number;
  conversionRate: number;
  averageSatisfaction: number;
}

export interface ReportData {
  stats: ReportStats;
  detailedData: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/api/reports`;

  constructor(private http: HttpClient) {}

  getReportData(startDate: string, endDate: string, reportType: string): Observable<ReportData> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('type', reportType);

    return this.http.get<ReportData>(`${this.apiUrl}`, { params });
  }

  exportReportData(startDate: string, endDate: string, reportType: string, format: string): Observable<Blob> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('type', reportType)
      .set('format', format);

    return this.http.get(`${this.apiUrl}/export`, {
      params: params,
      responseType: 'blob'
    });
  }
} 