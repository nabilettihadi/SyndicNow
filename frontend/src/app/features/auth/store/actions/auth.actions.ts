import {createAction, props} from '@ngrx/store';
import {LoginRequest, LoginResponse, RegisterRequest} from '../../models/auth.model';

// Initialize Auth State
export const initializeAuthState = createAction(
  '[Auth] Initialize Auth State'
);

export const initializeAuthStateSuccess = createAction(
  '[Auth] Initialize Auth State Success',
  props<{user: LoginResponse}>()
);

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{credentials: LoginRequest}>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{user: LoginResponse}>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{error: string}>()
);

// Register Actions
export const register = createAction(
  '[Auth] Register',
  props<{userData: RegisterRequest}>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{user: LoginResponse}>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{error: string}>()
);

// Logout Actions
export const logout = createAction(
  '[Auth] Logout'
);

export const logoutSuccess = createAction(
  '[Auth] Logout Success'
);

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{error: string}>()
);
