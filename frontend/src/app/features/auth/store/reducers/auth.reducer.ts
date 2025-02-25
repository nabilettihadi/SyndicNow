import {createReducer, on} from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import {User} from '../../models/auth.model';

export interface AuthState {
  user: User | null;
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
    user,
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

  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    loading: false,
    error: null
  }))
);
