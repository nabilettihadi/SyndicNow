export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;
  adresse: string;
  role: string;
}

export interface RegisterResponse {
  userId: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  token: string;
  createdAt: string;
} 