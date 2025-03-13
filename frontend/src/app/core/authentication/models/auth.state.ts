export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  token?: string;
} 