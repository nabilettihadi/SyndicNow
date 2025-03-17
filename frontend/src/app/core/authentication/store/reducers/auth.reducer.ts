import {createReducer, on} from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import {LoginResponse} from '../../models/auth.model';

export interface AuthState {
  user: LoginResponse | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,

  // Initialize auth state
  on(AuthActions.initializeAuthState, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.initializeAuthStateSuccess, (state, {user}) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),

  on(AuthActions.initializeAuthStateFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),

  // Login actions
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, (state, {user}) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),

  on(AuthActions.loginFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),

  // Register actions
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.registerSuccess, (state, {user}) => ({
    ...state,
    user: {
      userId: Number(user.userId),
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      token: '' // Le token sera géré par le service d'authentification
    },
    loading: false,
    error: null
  })),

  on(AuthActions.registerFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),

  // Logout actions
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.logoutSuccess, () => ({
    ...initialState
  })),

  on(AuthActions.logoutFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error
  })),

  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    error: null
  }))
);
