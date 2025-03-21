import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {Meeting} from '../models/meeting.model';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = `${environment.apiUrl}/api/v1/meetings`;

  constructor(private http: HttpClient) {
  }

  getAllMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(this.apiUrl);
  }

  getMeetingById(id: number): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.apiUrl}/${id}`);
  }

  getMeetingsByImmeuble(immeubleId: number): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.apiUrl}/immeuble/${immeubleId}`);
  }

  createMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http.post<Meeting>(this.apiUrl, meeting);
  }

  updateMeeting(id: number, meeting: Meeting): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.apiUrl}/${id}`, meeting);
  }

  deleteMeeting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateMeetingStatus(id: number, statut: string): Observable<Meeting> {
    return this.http.patch<Meeting>(`${this.apiUrl}/${id}/statut`, {statut});
  }

  addParticipant(id: number, participantId: number): Observable<Meeting> {
    return this.http.post<Meeting>(`${this.apiUrl}/${id}/participants`, {participantId});
  }

  removeParticipant(id: number, participantId: number): Observable<Meeting> {
    return this.http.delete<Meeting>(`${this.apiUrl}/${id}/participants/${participantId}`);
  }

  updateCompteRendu(id: number, compteRendu: string): Observable<Meeting> {
    return this.http.patch<Meeting>(`${this.apiUrl}/${id}/compte-rendu`, {compteRendu});
  }
}
