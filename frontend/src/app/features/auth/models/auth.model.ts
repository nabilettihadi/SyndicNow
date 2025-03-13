export enum UserRole {
  ADMIN = 'ADMIN',
  SYNDIC = 'SYNDIC',
  PROPRIETAIRE = 'PROPRIETAIRE'
}

export interface BaseUser {
  userId: number;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  token: string;
}

export interface LoginResponse extends BaseUser {
  isActive: boolean;
}

export interface RegisterResponse extends BaseUser {
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
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

export interface AuthState {
  user: LoginResponse | null;
  loading: boolean;
  error: string | null;
}

export interface AuthResponse {
  token: string;
  type: string;
  refreshToken: string;
  userId: number;
  email: string;
  role: UserRole;
}
