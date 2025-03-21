import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {environment} from '@env/environment';
import {Proprietaire, ProprietaireStats} from '@core/models/proprietaire.model';

@Injectable({
  providedIn: 'root'
})
export class ProprietaireService {
  private apiUrl = `${environment.apiUrl}/proprietaires`;

  constructor(private http: HttpClient) {
  }

  getAllProprietaires(): Observable<Proprietaire[]> {
    // Pour le développement, on utilise des données mock
    // En production, décommentez la ligne suivante pour utiliser l'API
    // return this.http.get<Proprietaire[]>(this.apiUrl);
    
    return of(this.getMockProprietaires()).pipe(delay(800));
  }

  getProprietaireById(id: number): Observable<Proprietaire> {
    // return this.http.get<Proprietaire>(`${this.apiUrl}/${id}`);
    const proprietaire = this.getMockProprietaires().find(p => p.id === id);
    return of(proprietaire as Proprietaire).pipe(delay(500));
  }

  createProprietaire(proprietaire: Partial<Proprietaire>): Observable<Proprietaire> {
    // return this.http.post<Proprietaire>(this.apiUrl, proprietaire);
    const newProprietaire = {
      ...proprietaire,
      id: Math.floor(Math.random() * 1000),
      dateCreation: new Date(),
      status: 'ACTIF',
    } as Proprietaire;
    
    return of(newProprietaire).pipe(delay(700));
  }

  updateProprietaire(id: number, proprietaire: Partial<Proprietaire>): Observable<Proprietaire> {
    // return this.http.put<Proprietaire>(`${this.apiUrl}/${id}`, proprietaire);
    const updatedProprietaire = {
      ...this.getMockProprietaires().find(p => p.id === id),
      ...proprietaire
    } as Proprietaire;
    
    return of(updatedProprietaire).pipe(delay(700));
  }

  deleteProprietaire(id: number): Observable<void> {
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    return of(void 0).pipe(delay(500));
  }

  getProprietaireStats(): Observable<ProprietaireStats> {
    return this.http.get<ProprietaireStats>(`${this.apiUrl}/stats`);
  }

  getProprietairesByVille(ville: string): Observable<Proprietaire[]> {
    return this.http.get<Proprietaire[]>(`${this.apiUrl}/ville/${ville}`);
  }

  getProprietairesByImmeuble(immeubleId: number): Observable<Proprietaire[]> {
    return this.http.get<Proprietaire[]>(`${this.apiUrl}/immeuble/${immeubleId}`);
  }

  assignerAppartement(id: number, appartementId: number): Observable<Proprietaire> {
    return this.http.post<Proprietaire>(`${this.apiUrl}/${id}/appartements/${appartementId}`, {});
  }

  // Mock data pour le développement
  private getMockProprietaires(): Proprietaire[] {
    return [
      {
        id: 1,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@example.com',
        telephone: '0612345678',
        status: 'ACTIF',
        dateCreation: new Date('2023-01-15'),
        appartements: [{ id: 101, numero: 'A101' }, { id: 102, numero: 'B205' }]
      },
      {
        id: 2,
        nom: 'Martin',
        prenom: 'Sophie',
        email: 'sophie.martin@example.com',
        telephone: '0687654321',
        status: 'ACTIF',
        dateCreation: new Date('2023-02-20'),
        appartements: [{ id: 103, numero: 'C301' }]
      },
      {
        id: 3,
        nom: 'Leroy',
        prenom: 'Thomas',
        email: 'thomas.leroy@example.com',
        telephone: '0698765432',
        status: 'INACTIF',
        dateCreation: new Date('2023-03-10'),
        appartements: []
      },
      {
        id: 4,
        nom: 'Dubois',
        prenom: 'Marie',
        email: 'marie.dubois@example.com',
        telephone: '0654321098',
        status: 'ACTIF',
        dateCreation: new Date('2023-04-05'),
        appartements: [{ id: 104, numero: 'D401' }]
      },
      {
        id: 5,
        nom: 'Garcia',
        prenom: 'Luc',
        email: 'luc.garcia@example.com',
        telephone: '0632109876',
        status: 'ACTIF',
        dateCreation: new Date('2023-05-15'),
        appartements: [{ id: 105, numero: 'E501' }]
      },
      {
        id: 6,
        nom: 'Petit',
        prenom: 'Julie',
        email: 'julie.petit@example.com',
        telephone: '0676543210',
        status: 'INACTIF',
        dateCreation: new Date('2023-06-22'),
        appartements: []
      },
      {
        id: 7,
        nom: 'Lefebvre',
        prenom: 'Nicolas',
        email: 'nicolas.lefebvre@example.com',
        telephone: '0678901234',
        status: 'ACTIF',
        dateCreation: new Date('2023-07-01'),
        appartements: [{ id: 106, numero: 'F601' }, { id: 107, numero: 'F602' }]
      },
      {
        id: 8,
        nom: 'Roux',
        prenom: 'Emilie',
        email: 'emilie.roux@example.com',
        telephone: '0689012345',
        status: 'ACTIF',
        dateCreation: new Date('2023-08-12'),
        appartements: [{ id: 108, numero: 'G701' }]
      },
      {
        id: 9,
        nom: 'Moreau',
        prenom: 'Philippe',
        email: 'philippe.moreau@example.com',
        telephone: '0690123456',
        status: 'INACTIF',
        dateCreation: new Date('2023-09-25'),
        appartements: []
      },
      {
        id: 10,
        nom: 'Simon',
        prenom: 'Celine',
        email: 'celine.simon@example.com',
        telephone: '0601234567',
        status: 'ACTIF',
        dateCreation: new Date('2023-10-08'),
        appartements: [{ id: 109, numero: 'H801' }]
      },
      {
        id: 11,
        nom: 'Laurent',
        prenom: 'Michel',
        email: 'michel.laurent@example.com',
        telephone: '0612345676',
        status: 'ACTIF',
        dateCreation: new Date('2023-11-14'),
        appartements: [{ id: 110, numero: 'I901' }, { id: 111, numero: 'I902' }]
      },
      {
        id: 12,
        nom: 'Mercier',
        prenom: 'Catherine',
        email: 'catherine.mercier@example.com',
        telephone: '0623456789',
        status: 'ACTIF',
        dateCreation: new Date('2023-12-03'),
        appartements: [{ id: 112, numero: 'J001' }]
      }
    ];
  }
}
