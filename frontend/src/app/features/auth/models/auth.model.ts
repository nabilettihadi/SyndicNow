export interface User {
  id: number;
  email: string;
  username: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
