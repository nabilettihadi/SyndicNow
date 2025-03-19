import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/api/v1/messages`;

  constructor(private http: HttpClient) {}

  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl);
  }

  getMessageById(id: number): Observable<Message> {
    return this.http.get<Message>(`${this.apiUrl}/${id}`);
  }

  getMessagesByImmeuble(immeubleId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/immeuble/${immeubleId}`);
  }

  getMessagesByUser(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/user/${userId}`);
  }

  getMessagesSent(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/sent/${userId}`);
  }

  getMessagesReceived(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/received/${userId}`);
  }

  createMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }

  updateMessage(id: number, message: Message): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${id}`, message);
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  markAsRead(id: number): Observable<Message> {
    return this.http.patch<Message>(`${this.apiUrl}/${id}/read`, {});
  }

  addAttachment(id: number, file: File): Observable<Message> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Message>(`${this.apiUrl}/${id}/attachments`, formData);
  }

  removeAttachment(id: number, attachmentId: number): Observable<Message> {
    return this.http.delete<Message>(`${this.apiUrl}/${id}/attachments/${attachmentId}`);
  }
} 