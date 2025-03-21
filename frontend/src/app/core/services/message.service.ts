import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '@env/environment';
import {Message} from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/api/v1/messages`;

  constructor(private http: HttpClient) {
  }

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

  getMessagesBySyndic(syndicId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/syndic/${syndicId}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des messages:', error);
        return of([]);
      })
    );
  }

  getMessagesByProprietaire(proprietaireId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/proprietaire/${proprietaireId}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des messages:', error);
        return of([]);
      })
    );
  }

  sendMessage(message: Partial<Message>): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'envoi du message:', error);
        throw error;
      })
    );
  }

  getIncidentNotifications(syndicId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/incidents/syndic/${syndicId}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des notifications d\'incidents:', error);
        return of([]);
      })
    );
  }

  countUnreadMessages(userId: number, userRole: string): Observable<number> {
    const endpoint = userRole.toLowerCase() === 'syndic'
      ? `${this.apiUrl}/unread/syndic/${userId}`
      : `${this.apiUrl}/unread/proprietaire/${userId}`;

    return this.http.get<number>(endpoint).pipe(
      catchError(error => {
        console.error('Erreur lors du comptage des messages non lus:', error);
        return of(0);
      })
    );
  }

  getMockMessages(userRole: 'syndic' | 'proprietaire'): Observable<Message[]> {
    const syndicMessages = [
      {
        id: 1,
        sender: 'Ahmed Benali',
        senderId: 2,
        receiverId: 1,
        subject: 'Question sur les charges',
        content: 'Bonjour, pourriez-vous me détailler les charges du mois de mars? Je trouve que le montant a considérablement augmenté par rapport au mois dernier. Cordialement.',
        date: '2023-03-28T10:30:00',
        read: false,
        imageUrl: 'https://randomuser.me/api/portraits/men/22.jpg'
      },
      {
        id: 2,
        sender: 'Fatima Zahra',
        senderId: 3,
        receiverId: 1,
        subject: 'Demande d\'autorisation de travaux',
        content: 'Bonjour, je souhaiterais obtenir une autorisation pour effectuer des travaux de rénovation dans ma salle de bain. Les travaux dureraient environ 2 semaines. Pourriez-vous m\'indiquer la procédure à suivre? Merci d\'avance.',
        date: '2023-03-25T14:15:00',
        read: true,
        imageUrl: 'https://randomuser.me/api/portraits/women/28.jpg'
      },
      {
        id: 3,
        sender: 'Karim Idrissi',
        senderId: 4,
        receiverId: 1,
        subject: 'Problème de voisinage',
        content: 'Bonjour, je vous contacte au sujet du bruit excessif provenant de l\'appartement au-dessus du mien. Malgré plusieurs tentatives de dialogue, la situation persiste. Pourriez-vous intervenir? Merci.',
        date: '2023-03-20T09:45:00',
        read: true,
        imageUrl: 'https://randomuser.me/api/portraits/men/35.jpg'
      },
      {
        id: 4,
        sender: 'Système - Incident',
        senderId: 0,
        receiverId: 1,
        subject: '[URGENT] Fuite d\'eau - Appartement A102',
        content: 'Une fuite d\'eau a été signalée dans l\'appartement A102 par le propriétaire M. Youssef Alami. Le propriétaire décrit une fuite importante au niveau de la salle de bain qui commence à affecter l\'appartement en dessous.',
        date: '2023-03-27T16:20:00',
        read: false,
        isIncident: true,
        incidentId: 101,
        incidentStatus: 'NOUVEAU',
        incidentPriority: 'HAUTE',
        appartementNumber: 'A102',
        immeubleId: 1,
        immeubleName: 'Résidence Les Oliviers'
      },
      {
        id: 5,
        sender: 'Système - Incident',
        senderId: 0,
        receiverId: 1,
        subject: 'Problème électrique - Appartement B205',
        content: 'Un problème électrique a été signalé dans l\'appartement B205 par la propriétaire Mme Naima Sabri. Des coupures fréquentes se produisent dans tout l\'appartement, principalement le soir.',
        date: '2023-03-26T11:05:00',
        read: true,
        isIncident: true,
        incidentId: 102,
        incidentStatus: 'EN_COURS',
        incidentPriority: 'MOYENNE',
        appartementNumber: 'B205',
        immeubleId: 2,
        immeubleName: 'Résidence Les Jardins'
      }
    ];

    const proprietaireMessages = [
      {
        id: 1,
        sender: 'Syndic Principal',
        senderId: 1,
        receiverId: 2,
        subject: 'Assemblée générale extraordinaire',
        content: 'Chers propriétaires, une assemblée générale extraordinaire aura lieu le 15 avril 2023 à 18h dans la salle commune. Ordre du jour : vote du budget de rénovation de la toiture.',
        date: '2023-03-28T10:30:00',
        read: false,
        imageUrl: 'https://randomuser.me/api/portraits/men/41.jpg'
      },
      {
        id: 2,
        sender: 'Service Technique',
        senderId: 3,
        receiverId: 2,
        subject: 'Intervention plomberie programmée',
        content: 'Suite à votre signalement de fuite dans la salle de bain, nous avons programmé l\'intervention d\'un plombier le 5 avril entre 9h et 11h. Merci de vous assurer que quelqu\'un sera présent.',
        date: '2023-03-25T14:15:00',
        read: true,
        imageUrl: 'https://randomuser.me/api/portraits/women/22.jpg'
      },
      {
        id: 3,
        sender: 'Syndic Principal',
        senderId: 1,
        receiverId: 2,
        subject: 'Rappel : paiement des charges',
        content: 'Nous vous rappelons que le paiement des charges du premier trimestre est dû avant le 31 mars. Merci de régulariser votre situation si ce n\'est pas déjà fait.',
        date: '2023-03-20T09:45:00',
        read: true,
        imageUrl: 'https://randomuser.me/api/portraits/men/41.jpg'
      }
    ];

    return of(userRole === 'syndic' ? syndicMessages : proprietaireMessages);
  }
}
