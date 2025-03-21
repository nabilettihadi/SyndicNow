export interface Message {
  id: number;
  sender: string;
  senderId: number;
  receiverId: number;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  isIncident?: boolean;
  incidentId?: number;
  incidentStatus?: string;
  incidentPriority?: string;
  appartementNumber?: string;
  immeubleId?: number;
  immeubleName?: string;
  imageUrl?: string;
} 