import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {Syndic, SyndicStats} from '@core/models/syndic.model';

@Injectable({
  providedIn: 'root'
})
export class SyndicService {
  private apiUrl = `${environment.apiUrl}/syndics`;

  constructor(private http: HttpClient) {
  }

  // Récupérer tous les syndics
  getAllSyndics(): Observable<Syndic[]> {
    return this.http.get<Syndic[]>(this.apiUrl);
  }

  // Récupérer un syndic par son ID
  getSyndicById(id: number): Observable<Syndic> {
    return this.http.get<Syndic>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau syndic
  createSyndic(syndic: Partial<Syndic>): Observable<Syndic> {
    return this.http.post<Syndic>(this.apiUrl, syndic);
  }

  // Mettre à jour un syndic
  updateSyndic(id: number, syndic: Partial<Syndic>): Observable<Syndic> {
    return this.http.put<Syndic>(`${this.apiUrl}/${id}`, syndic);
  }

  // Supprimer un syndic
  deleteSyndic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les statistiques des syndics
  getSyndicStats(): Observable<SyndicStats> {
    return this.http.get<SyndicStats>(`${this.apiUrl}/stats`);
  }

  // Récupérer les syndics par ville
  getSyndicsByVille(ville: string): Observable<Syndic[]> {
    return this.http.get<Syndic[]>(`${this.apiUrl}/ville/${ville}`);
  }

  // Récupérer les syndics par statut
  getSyndicsByStatus(status: string): Observable<Syndic[]> {
    return this.http.get<Syndic[]>(`${this.apiUrl}/status/${status}`);
  }

  // Récupérer les syndics par immeuble
  getSyndicsByImmeuble(immeubleId: number): Observable<Syndic[]> {
    return this.http.get<Syndic[]>(`${this.apiUrl}/immeuble/${immeubleId}`);
  }

  // Assigner un immeuble à un syndic
  assignerImmeuble(id: number, immeubleId: number): Observable<Syndic> {
    return this.http.post<Syndic>(`${this.apiUrl}/${id}/immeubles/${immeubleId}`, {});
  }

  retirerImmeuble(id: number, immeubleId: number): Observable<Syndic> {
    return this.http.delete<Syndic>(`${this.apiUrl}/${id}/immeubles/${immeubleId}`);
  }

  terminerMandat(id: number, dateFin: Date): Observable<Syndic> {
    return this.http.patch<Syndic>(`${this.apiUrl}/${id}/fin-mandat`, {dateFin});
  }

  ajouterDocument(id: number, file: File): Observable<Syndic> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Syndic>(`${this.apiUrl}/${id}/documents`, formData);
  }

  supprimerDocument(id: number, documentId: number): Observable<Syndic> {
    return this.http.delete<Syndic>(`${this.apiUrl}/${id}/documents/${documentId}`);
  }
}
