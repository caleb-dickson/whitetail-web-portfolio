import { createAction, props } from '@ngrx/store';

export const emailPassLoginStart = createAction(
  '[Auth] Login Start',
  props<{
    saveNewUser: boolean;
    email: string;
    password: string;
    signInMethod: string;
  }>()
);
export const googleLoginStart = createAction('[Auth] Google Login Start');
export const emailPassSignupStart = createAction(
  '[Auth] Signup Start',
  props<{
    saveNewUser: boolean;
    displayName: string;
    email: string;
    password: string;
    signInMethod: string;
    returnSecureToken: boolean;
    firstName?: string;
    lastName?: string;
    userPhotoURL?: string;
    phoneNumber?: string;
  }>()
);
export const setUserProfile = createAction(
  '[Auth] Set User Profile',
  props<{
    authType: string;
    displayName: string;
    email: string;
    localId: string;
    userPhotoURL: string;
    phoneNumber: string;
  }>()
)
export const authSuccess = createAction(
  '[Auth] Authenticate Success',
  props<{
    displayName: string;
    email: string;
    localId: string;
    signInMethod: string;
    token: string;
    expirationDate: Date;
    redirect: boolean;
    firstName?: string;
    lastName?: string;
    userPhotoURL?: string;
    phoneNumber?: string;
  }>()
);
export const authFail = createAction(
  '[Auth] Authenticate Fail',
  props<{ errorMessage: string }>()
);
export const clearError = createAction('[Auth] Clear Error');
export const autoLogin = createAction('[Auth] Auto Login');
export const logout = createAction('[Auth] Logout');
