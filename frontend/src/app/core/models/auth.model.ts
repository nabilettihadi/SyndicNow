export interface LoginResponse {
  userId: number;
  username: string;
  email: string;
  roles: string[];
  token: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}