import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Budget } from '../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = `${environment.apiUrl}/api/v1/budgets`;

  constructor(private http: HttpClient) {}

  getAllBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl);
  }

  getBudgetById(id: number): Observable<Budget> {
    return this.http.get<Budget>(`${this.apiUrl}/${id}`);
  }

  getBudgetsByImmeuble(immeubleId: number): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/immeuble/${immeubleId}`);
  }

  getBudgetsByAnnee(annee: number): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/annee/${annee}`);
  }

  createBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, budget);
  }

  updateBudget(id: number, budget: Budget): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/${id}`, budget);
  }

  deleteBudget(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addCategorie(id: number, categorie: any): Observable<Budget> {
    return this.http.post<Budget>(`${this.apiUrl}/${id}/categories`, categorie);
  }

  updateCategorie(id: number, categorieId: number, categorie: any): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/${id}/categories/${categorieId}`, categorie);
  }

  deleteCategorie(id: number, categorieId: number): Observable<Budget> {
    return this.http.delete<Budget>(`${this.apiUrl}/${id}/categories/${categorieId}`);
  }

  addDepense(id: number, depense: any): Observable<Budget> {
    return this.http.post<Budget>(`${this.apiUrl}/${id}/depenses`, depense);
  }

  updateDepense(id: number, depenseId: number, depense: any): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/${id}/depenses/${depenseId}`, depense);
  }

  deleteDepense(id: number, depenseId: number): Observable<Budget> {
    return this.http.delete<Budget>(`${this.apiUrl}/${id}/depenses/${depenseId}`);
  }

  cloturerBudget(id: number): Observable<Budget> {
    return this.http.patch<Budget>(`${this.apiUrl}/${id}/cloturer`, {});
  }
} 