import { Action, createReducer, on } from '@ngrx/store';
import { UserAuthData } from '../auth-control/user-auth.model';
import { UserProfileData } from '../auth-control/user-profile.model';
import * as AuthActions from './auth.actions';

export interface State {
  userAuth: UserAuthData;
  userProfile: UserProfileData;
  authError: string;
  loading: boolean;
}
const initialState: State = { userAuth: null, userProfile: null, authError: null, loading: false };

export function authReducer(authState: State | undefined, authAction: Action) {
  return createReducer(
    initialState,
    on(AuthActions.emailPassLoginStart, AuthActions.emailPassSignupStart, (state) => ({
      ...state,
      authError: null,
      loading: true,
    })),
    on(AuthActions.googleLoginStart, (state) => ({
      ...state,
      authError: null,
      loading: true
    })),
    on(AuthActions.authSuccess, (state, action) => ({
      ...state,
      authError: null,
      loading: false,
      userAuth: new UserAuthData(
        action.signInMethod,
        action.email,
        action.localId,
        action.token,
        action.expirationDate,
        action.displayName,
        action.firstName,
        action.lastName,
        action.userPhotoURL,
        action.phoneNumber
      ),
    })),
    on(AuthActions.setUserProfile, (state, action) => ({
      ...state,
      authError: null,
      loading: false,
      userProfile: new UserProfileData(
        action.authType,
        action.displayName,
        action.email,
        action.localId,
        action.userPhotoURL,
        action.phoneNumber
      ),
    })),
    on(AuthActions.authFail, (state, action) => ({
      ...state,
      userAuth: null,
      authError: action.errorMessage,
      loading: false,
    })),
    on(AuthActions.logout, (state) => ({ ...state, userAuth: null, userProfile: null })),
    on(AuthActions.clearError, (state) => ({ ...state, authError: null }))
  )(authState, authAction);
}
