import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService, ReportStats, ReportData } from '@core/services/report.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: []
})
export class ReportsComponent implements OnInit {
  // Filtres de période
  startDate: string = '';
  endDate: string = '';
  selectedReportType: string = 'general';

  // Données statistiques
  stats: ReportStats = {
    totalUsers: 0,
    totalPayments: 0,
    conversionRate: 0,
    averageSatisfaction: 0
  };

  // Données détaillées pour le tableau
  detailedData: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    // Initialiser les dates
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    this.startDate = this.formatDateForInput(oneMonthAgo);
    this.endDate = this.formatDateForInput(today);
    
    // Charger les données initiales
    this.loadReportData();
  }

  onDateChange(): void {
    this.loadReportData();
  }

  onReportTypeChange(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.isLoading = true;
    this.error = null;
    
    this.reportService.getReportData(
      this.startDate,
      this.endDate,
      this.selectedReportType
    ).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des rapports', error);
        this.error = 'Impossible de charger les données des rapports. Veuillez réessayer plus tard.';
        return of({ 
          stats: {
            totalUsers: 0,
            totalPayments: 0,
            conversionRate: 0,
            averageSatisfaction: 0
          },
          detailedData: []
        } as ReportData);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((data: ReportData) => {
      if (data.stats) {
        this.stats = data.stats;
        this.detailedData = data.detailedData;
      }
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR');
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
