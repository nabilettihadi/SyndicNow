import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  stats = {
    totalUsers: 0,
    totalPayments: 0,
    conversionRate: 0,
    averageSatisfaction: 0
  };

  // Données détaillées pour le tableau
  detailedData: any[] = [];

  constructor() {}

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
    // Simuler le chargement des données
    // Dans une application réelle, vous appelleriez un service
    setTimeout(() => {
      this.stats = {
        totalUsers: 2548,
        totalPayments: 245690,
        conversionRate: 68.5,
        averageSatisfaction: 4.2
      };

      this.detailedData = [
        { date: new Date(2025, 2, 1), users: 150, payments: 12500, conversionRate: 65.3 },
        { date: new Date(2025, 2, 8), users: 180, payments: 18700, conversionRate: 67.8 },
        { date: new Date(2025, 2, 15), users: 210, payments: 22400, conversionRate: 71.2 },
        { date: new Date(2025, 2, 21), users: 225, payments: 26800, conversionRate: 72.5 }
      ];
    }, 500);
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
