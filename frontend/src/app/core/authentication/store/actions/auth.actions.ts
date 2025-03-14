import { createAction, props } from '@ngrx/store';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../../models/auth.model';

export const initializeAuthState = createAction('[Auth] Initialize State');

export const initializeAuthStateSuccess = createAction(
  '[Auth] Initialize State Success',
  props<{ user: LoginResponse }>()
);

export const initializeAuthStateFailure = createAction(
  '[Auth] Initialize State Failure',
  props<{ error: string }>()
);

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: LoginResponse }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{ userData: RegisterRequest }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: RegisterResponse }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: string }>()
);

export const clearAuthError = createAction('[Auth] Clear Error'); 