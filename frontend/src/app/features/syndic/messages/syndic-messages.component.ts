import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { AuthService } from '@core/services/auth.service';
import { MessageService } from '@core/services/message.service';
import { Message } from '@core/models/message.model';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-syndic-messages',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './syndic-messages.component.html'
})
export class SyndicMessagesComponent implements OnInit {
  messages: Message[] = [];
  proprietaireMessages: Message[] = [];
  incidentMessages: Message[] = [];
  filteredMessages: Message[] = [];
  selectedMessage: Message | null = null;
  newMessage: Partial<Message> = {
    subject: '',
    content: '',
  };
  showNewMessageForm = false;
  searchTerm = '';
  filterOption: 'all' | 'unread' | 'read' | 'incidents' | 'proprietaires' = 'all';
  loading = false;
  error: string | null = null;
  
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  private loadMessages(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      // Pour le développement, utiliser les données simulées
      this.messageService.getMockMessages('syndic')
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (messages) => {
            this.messages = messages;
            // Séparer les messages d'incidents et les messages des propriétaires
            this.proprietaireMessages = this.messages.filter(msg => !msg.isIncident);
            this.incidentMessages = this.messages.filter(msg => msg.isIncident);
            this.applyFilters();
          },
          error: (err) => {
            console.error('Erreur lors du chargement des messages', err);
            this.error = 'Impossible de charger les messages. Veuillez réessayer plus tard.';
          }
        });
    } else {
      this.loading = false;
      this.error = 'Vous devez être connecté pour accéder à vos messages.';
    }
  }

  selectMessage(message: Message): void {
    this.selectedMessage = message;
    if (!message.read) {
      message.read = true;
      // Dans une application réelle, appeler le service pour marquer comme lu
      // this.messageService.markAsRead(message.id).subscribe();
    }
  }

  toggleNewMessageForm(): void {
    this.showNewMessageForm = !this.showNewMessageForm;
    if (this.showNewMessageForm) {
      this.selectedMessage = null;
    }
  }

  sendMessage(): void {
    if (!this.newMessage.subject || !this.newMessage.content) {
      this.error = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      const newMsg: Partial<Message> = {
        senderId: currentUser.userId,
        sender: 'Vous (Syndic)',
        receiverId: 2, // Simulation - ID d'un propriétaire
        subject: this.newMessage.subject,
        content: this.newMessage.content,
        date: new Date().toISOString(),
        read: true
      };

      // Pour le développement, simuler l'envoi
      // Dans une application réelle, appeler le service
      // this.messageService.sendMessage(newMsg).subscribe({...});
      
      // Simulation
      setTimeout(() => {
        const sentMessage = {
          id: this.messages.length + 1,
          ...newMsg
        } as Message;
        
        this.messages.unshift(sentMessage);
        this.proprietaireMessages.unshift(sentMessage);
        this.applyFilters();
        this.newMessage = { subject: '', content: '' };
        this.showNewMessageForm = false;
        this.error = null;
        this.loading = false;
      }, 800);
    } else {
      this.loading = false;
      this.error = 'Vous devez être connecté pour envoyer un message.';
    }
  }

  applyFilters(): void {
    let filteredList = this.messages;
    
    // Filtre par type de message
    if (this.filterOption === 'incidents') {
      filteredList = this.incidentMessages;
    } else if (this.filterOption === 'proprietaires') {
      filteredList = this.proprietaireMessages;
    }
    
    // Filtre par statut de lecture
    if (this.filterOption === 'unread') {
      filteredList = filteredList.filter(message => !message.read);
    } else if (this.filterOption === 'read') {
      filteredList = filteredList.filter(message => message.read);
    }
    
    // Filtre par recherche
    this.filteredMessages = filteredList.filter(message => {
      const matchesSearch = !this.searchTerm || 
                           message.subject.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           message.content.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           message.sender.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           (message.immeubleName && message.immeubleName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
                           (message.appartementNumber && message.appartementNumber.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
  }
  
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  viewIncident(incidentId: number | undefined): void {
    if (incidentId) {
      // Navigation vers la page de détail de l'incident
      this.router.navigate(['/syndic/incidents', incidentId]);
    }
  }

  updateIncidentStatus(incidentId: number | undefined, newStatus: string): void {
    if (incidentId) {
      this.loading = true;
      // Dans une application réelle, appeler un service d'incidents
      // this.incidentService.updateStatus(incidentId, newStatus).subscribe({...});
      
      // Simulation de mise à jour
      setTimeout(() => {
        this.incidentMessages.forEach(message => {
          if (message.incidentId === incidentId && message.incidentStatus) {
            message.incidentStatus = newStatus;
          }
        });
        
        // Mettre à jour les messages filtrés aussi
        this.applyFilters();
        this.loading = false;
      }, 800);
    }
  }
} 