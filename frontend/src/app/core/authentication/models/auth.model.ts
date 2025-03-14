export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: UserRole;
  telephone: string;
  adresse: string;
  cin: string;
  siret?: string;
  numeroLicence?: string;
  societe?: string;
  dateDebutActivite?: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
}

export type UserRole = 'ADMIN' | 'SYNDIC' | 'PROPRIETAIRE';

export interface AuthState {
  user: LoginResponse | null;
  loading: boolean;
  error: string | null;
} 