export interface User {
  userId?: number;
  email: string;
  nom?: string;
  prenom?: string;
  role: string;
  token: string;
  isActive?: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;
  adresse?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  refreshToken: string;
  id: number;
  email: string;
  role: string;
}

export enum UserRole {
  SYNDIC = 'SYNDIC',
  PROPRIETAIRE = 'PROPRIETAIRE'
}
