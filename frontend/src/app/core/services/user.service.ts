import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {AuthService} from './auth.service';

export interface ActivityItem {
  type: string;
  title: string;
  description: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, user);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getRecentActivities(): Observable<ActivityItem[]> {
    return this.http.get<ActivityItem[]>(`${this.apiUrl}/activities/recent`);
  }

  /**
   * Met à jour le profil de l'utilisateur connecté
   * @param userData Les données à mettre à jour
   * @returns Les données de l'utilisateur mises à jour
   */
  updateProfile(userData: any): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Aucun utilisateur connecté');
    }

    // Déterminer l'URL en fonction du rôle de l'utilisateur
    let profileUrl = '';
    switch (currentUser.role) {
      case 'SYNDIC':
        profileUrl = `${environment.apiUrl}/api/syndics/profile`;
        break;
      case 'PROPRIETAIRE':
        profileUrl = `${environment.apiUrl}/api/proprietaires/profile`;
        break;
      case 'ADMIN':
        profileUrl = `${environment.apiUrl}/api/admin/profile`;
        break;
      default:
        throw new Error('Rôle utilisateur non pris en charge');
    }

    return this.http.put<any>(profileUrl, userData);
  }
}
