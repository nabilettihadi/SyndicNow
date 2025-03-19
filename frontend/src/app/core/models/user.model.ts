export enum UserRole {
  ADMIN = 'ADMIN',
  SYNDIC = 'SYNDIC',
  PROPRIETAIRE = 'PROPRIETAIRE'
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: User;
  token: string;
} 