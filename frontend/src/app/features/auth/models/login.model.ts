export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  token: string;
  isActive: boolean;
} 