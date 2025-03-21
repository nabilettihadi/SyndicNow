import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { AuthService } from '@core/services/auth.service';
import { MessageService } from '@core/services/message.service';
import { Message } from '@core/models/message.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-mes-messages',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './mes-messages.component.html'
})
export class MesMessagesComponent implements OnInit {
  messages: Message[] = [];
  filteredMessages: Message[] = [];
  selectedMessage: Message | null = null;
  newMessage: Partial<Message> = {
    subject: '',
    content: '',
  };
  showNewMessageForm = false;
  searchTerm = '';
  filterOption: 'all' | 'unread' | 'read' = 'all';
  loading = false;
  error: string | null = null;
  
  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  private loadMessages(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      // Pour le développement, utiliser les données simulées
      this.messageService.getMockMessages('proprietaire')
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (messages) => {
            this.messages = messages;
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
        sender: 'Vous',
        receiverId: 1, // Simulation - ID du syndic
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
    this.filteredMessages = this.messages.filter(message => {
      const matchesSearch = !this.searchTerm || 
                            message.subject.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            message.content.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            message.sender.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesFilter = this.filterOption === 'all' || 
                            (this.filterOption === 'unread' && !message.read) ||
                            (this.filterOption === 'read' && message.read);
      
      return matchesSearch && matchesFilter;
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
} 