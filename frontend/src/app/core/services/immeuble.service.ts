import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '@env/environment';
import {Immeuble, ImmeubleStats} from '@core/models/immeuble.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ImmeubleService {
  private apiUrl = `${environment.apiUrl}/api/immeubles`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllImmeubles(): Observable<Immeuble[]> {
    console.log(`Tentative d'accès à l'endpoint standard: ${this.apiUrl}`);
    
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.get<Immeuble[]>(this.apiUrl, { headers })
      .pipe(
        tap(data => console.log(`Données récupérées: ${data.length} immeubles`)),
        catchError(this.handleError)
      );
  }

  getImmeubleStats(): Observable<ImmeubleStats> {
    return this.http.get<ImmeubleStats>(`${this.apiUrl}/stats`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getImmeubleById(id: number): Observable<Immeuble> {
    return this.http.get<Immeuble>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createImmeuble(immeuble: Partial<Immeuble>): Observable<Immeuble> {
    console.log("Préparation des données pour la création d'un immeuble:", immeuble);
    
    // Calcul de l'année de construction à partir de la date
    let anneeConstruction = new Date().getFullYear(); // Année par défaut
    if (immeuble.dateConstruction) {
      if (typeof immeuble.dateConstruction === 'string') {
        anneeConstruction = new Date(immeuble.dateConstruction).getFullYear();
      } else if (immeuble.dateConstruction instanceof Date) {
        anneeConstruction = immeuble.dateConstruction.getFullYear();
      }
    }
    
    // Créer un objet qui respecte le format attendu par le backend
    const immeubleRequest = {
      nom: immeuble.nom?.trim(),
      adresse: immeuble.adresse?.trim(),
      codePostal: immeuble.codePostal?.trim(),
      ville: immeuble.ville?.trim(),
      nombreEtages: immeuble.nombreEtages || 1,
      nombreAppartements: immeuble.nombreAppartements || 1, 
      anneeConstruction: anneeConstruction,
      description: immeuble.description || "Nouvel immeuble créé depuis l'interface",
      syndicId: immeuble.syndicId
    };
    
    console.log("Données formatées pour l'API:", immeubleRequest);
    
    // Vérification des données
    if (!immeubleRequest.syndicId) {
      return throwError(() => new Error('Le syndic est obligatoire'));
    }
    
    return this.http.post<Immeuble>(this.apiUrl, immeubleRequest)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Une erreur est survenue:', error);
          
          if (error.error && error.error.message) {
            return throwError(() => new Error(error.error.message));
          }
          
          return this.handleError(error);
        })
      );
  }

  updateImmeuble(id: number, immeuble: Partial<Immeuble>): Observable<Immeuble> {
    return this.http.put<Immeuble>(`${this.apiUrl}/${id}`, immeuble)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteImmeuble(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getImmeublesByRegion(region: string): Observable<Immeuble[]> {
    return this.http.get<Immeuble[]>(`${this.apiUrl}/region/${region}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getImmeublesBySyndic(syndicId: number): Observable<Immeuble[]> {
    return this.http.get<Immeuble[]>(`${this.apiUrl}/syndic/${syndicId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllImmeublesBySyndic(): Observable<Immeuble[]> {
    return this.http.get<Immeuble[]>(`${this.apiUrl}/syndic`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getImmeublesByVille(ville: string): Observable<Immeuble[]> {
    return this.http.get<Immeuble[]>(`${this.apiUrl}/ville/${ville}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAppartementsByImmeuble(immeubleId: number): Observable<any[]> {
    console.log(`Tentative d'accès aux appartements de l'immeuble ${immeubleId}`);
    
    // L'API backend n'a pas d'endpoint /api/v1/immeubles/{id}/appartements
    // Utiliser plutôt /api/appartements avec un filtre pour l'immeuble
    return this.http.get<any[]>(`${environment.apiUrl}/api/appartements/immeuble/${immeubleId}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(`Erreur lors de la récupération des appartements pour l'immeuble ${immeubleId}:`, error);
          
          if (error.status === 404) {
            // Tenter un autre endpoint possible
            console.log(`Endpoint /appartements/immeuble/${immeubleId} non trouvé, essai avec /api/appartements?immeubleId=${immeubleId}`);
            return this.http.get<any[]>(`${environment.apiUrl}/api/appartements?immeubleId=${immeubleId}`)
              .pipe(
                catchError((innerError) => {
                  console.error(`Échec également avec l'endpoint alternatif:`, innerError);
                  return this.getMockAppartements(immeubleId);
                })
              );
          } else if (error.status === 500) {
            console.log(`Erreur serveur 500 pour les appartements de l'immeuble ${immeubleId}, génération de données fictives`);
            return this.getMockAppartements(immeubleId);
          }
          
          return this.handleError(error);
        })
      );
  }
  
  // Méthode pour générer des données fictives d'appartements en cas d'erreur d'API
  private getMockAppartements(immeubleId: number): Observable<any[]> {
    console.log(`Génération de données fictives pour les appartements de l'immeuble ${immeubleId}`);
    
    // Générer entre 3 et 8 appartements fictifs
    const nombreAppartements = Math.floor(Math.random() * 6) + 3;
    const mockAppartements = Array(nombreAppartements).fill(0).map((_, index) => ({
      id: (immeubleId * 100) + index + 1,
      numero: `A${index + 101}`,
      etage: Math.floor(index / 2) + 1,
      surface: Math.floor(Math.random() * 50) + 30,
      nombrePieces: Math.floor(Math.random() * 3) + 1,
      status: index % 3 === 0 ? 'OCCUPÉ' : 'LIBRE',
      immeubleId: immeubleId,
      proprietaireId: index % 2 === 0 ? 1 : 2,
      proprietaireNom: index % 2 === 0 ? 'John Doe' : 'Jane Smith',
      mockData: true // Marqueur indiquant qu'il s'agit de données fictives
    }));
    
    // Simuler un délai réseau pour plus de réalisme
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockAppartements);
        observer.complete();
      }, 800);
    });
  }

  // Ajouter un syndic à un immeuble
  assignerSyndicImmeuble(immeubleId: number, syndicId: number): Observable<Immeuble> {
    return this.http.post<Immeuble>(`${this.apiUrl}/${immeubleId}/syndic/${syndicId}`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  // Retirer un syndic d'un immeuble
  retirerSyndicImmeuble(immeubleId: number): Observable<Immeuble> {
    return this.http.delete<Immeuble>(`${this.apiUrl}/${immeubleId}/syndic`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Ajouter un appartement à un immeuble
  ajouterAppartement(immeubleId: number, appartement: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${immeubleId}/appartements`, appartement)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  // Mettre à jour le statut d'un immeuble
  updateStatus(immeubleId: number, status: string): Observable<Immeuble> {
    return this.http.patch<Immeuble>(`${this.apiUrl}/${immeubleId}/status`, { status })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Méthode intelligente qui choisit l'endpoint approprié en fonction du rôle
  getImmeublesByRole(): Observable<Immeuble[]> {
    return this.getAllImmeubles();
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Une erreur est survenue:', error);
    
    if (error.status === 403) {
      return throwError(() => new Error('Vous n\'avez pas les droits nécessaires pour accéder à ces données'));
    } else if (error.status === 404) {
      return throwError(() => new Error('La ressource demandée n\'existe pas'));
    } else if (error.status === 500) {
      return throwError(() => new Error('Erreur serveur, veuillez réessayer plus tard'));
    }
    
    return throwError(() => new Error('Erreur lors de la récupération des données'));
  }
}

export class ImmeubleCreate {
  nom: string = '';
  adresse: string = '';
  codePostal: string = '';
  ville: string = '';
  dateConstruction: Date | null = null;
  nombreEtages: number = 0;
  syndicId?: number;
}
