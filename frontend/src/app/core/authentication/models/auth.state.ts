export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  token?: string;
} 