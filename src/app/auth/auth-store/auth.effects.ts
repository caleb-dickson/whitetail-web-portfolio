import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromAppStore from '../../app-store/app.reducer';
import * as AuthActions from './auth.actions';

import { Auth, signOut } from '@angular/fire/auth';

import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { AuthService } from '../auth-control/auth.service';

import { UserAuthData } from '../auth-control/user-auth.model';
import { UserProfileData } from '../auth-control/user-profile.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  displayName?: string;
  registered?: boolean;
}

const handleAuth = (
  signInMethod: string,
  email: string,
  localId: string,
  token: string,
  expiresIn: number,
  displayName?: string,
  firstName?: string,
  lastName?: string,
  userPhotoURL?: string,
  phoneNumber?: string
) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const emailPassUser = new UserAuthData(
    signInMethod,
    email,
    localId,
    token,
    expirationDate,
    displayName,
    firstName,
    lastName,
    userPhotoURL,
    phoneNumber
  );
  localStorage.setItem('userAuthData', JSON.stringify(emailPassUser));
  return { type: 'waiting on Firestore' };
};

const handleError = (errorRes: HttpErrorResponse) => {
  console.log(errorRes);
  let errorMessage = 'Unknown error';
  if (!errorRes.error || !errorRes.error.error) {
    console.log(errorRes);
    return of(AuthActions.authFail({ errorMessage }));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'Email already in use';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'Invalid email';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Invalid password';
      break;
  }
  return of(AuthActions.authFail({ errorMessage }));
};

@Injectable()
export class AuthEffects {
  emailPassSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.emailPassSignupStart),
      switchMap((action) => {
        return this.http
          .post<AuthResponseData>(
            'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' +
              environment.firebase.apiKey,
            {
              saveNewUser: action.saveNewUser,
              displayName: action.firstName + ' ' + action.lastName,
              email: action.email,
              password: action.password,
              signInMethod: action.signInMethod,
              returnSecureToken: true,
              userPhotoURL: action.userPhotoURL,
              phoneNumber: action.phoneNumber,
            }
          )
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
              this.authService.saveNewUser({
                authType: 'email-and-password',
                email: action.email,
                localId: resData.localId,
                displayName: action.firstName + ' ' + action.lastName,
                userPhotoURL: action.userPhotoURL,
                phoneNumber: action.phoneNumber,
              });
              console.log(action.signInMethod);
            }),
            map((resData) => {
              return handleAuth(
                'email-and-password',
                resData.email,
                resData.localId,
                resData.idToken,
                +resData.expiresIn,
                resData.displayName,
                action.firstName,
                action.lastName,
                action.userPhotoURL,
                action.phoneNumber
              );
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    )
  );

  googleLoginStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.googleLoginStart),
      map(() => {
        this.authService.loginWithGoogle();
        return { type: 'dummy data' };
      })
    )
  );

  emailPassLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.emailPassLoginStart),
      switchMap((action) => {
        return this.http
          .post<AuthResponseData>(
            'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
              environment.firebase.apiKey,
            {
              saveNewUser: action.saveNewUser,
              email: action.email,
              password: action.password,
              signInMethod: action.signInMethod,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
              return this.authService.getDBuser({
                saveNewUser: action.saveNewUser,
                authType: 'email-and-password',
                displayName: null,
                email: resData.email,
                localId: resData.localId,
                userPhotoURL: null,
                phoneNumber: null,
              });
            }),
            map((resData) => {
              return handleAuth(
                'email-and-password',
                resData.email,
                resData.localId,
                resData.idToken,
                +resData.expiresIn
              );
            }),
            catchError((errorRes) => {
              return handleError(errorRes);
            })
          );
      })
    )
  );

  authRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authSuccess),
        tap(
          (action) =>
            action.redirect &&
            this.router.navigate(['/']) &&
            this.dialog.closeAll()
        )
      ),
    { dispatch: false }
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        // USER AUTH DATA
        const userData: {
          signInMethod: string;
          email: string;
          localId: string;
          _token: string;
          _tokenExpirationDate: string;
          displayName?: string;
          firstName?: string;
          lastName?: string;
          userPhotoURL?: string;
          phoneNumber?: string;
        } = JSON.parse(localStorage.getItem('userAuthData'));
        if (!userData) {
          return { type: 'dummy data' };
        }

        const loadedUser = new UserAuthData(
          userData.signInMethod,
          userData.email,
          userData.localId,
          userData._token,
          new Date(userData._tokenExpirationDate),
          userData.displayName,
          userData.firstName,
          userData.lastName,
          userData.userPhotoURL,
          userData.phoneNumber
        );
        // USER AUTH DATA

        // USER PROFILE DATA
        const userProfile: {
          authType: string;
          displayName: string;
          email: string;
          localId: string;
          userPhotoURL: string;
          phoneNumber: string;
        } = JSON.parse(localStorage.getItem('userProfile'));
        if (!userProfile) {
          return { type: 'dummy data' };
        }

        const loadedUserProfile = new UserProfileData(
          userProfile.authType,
          userProfile.displayName,
          userProfile.email,
          userProfile.localId,
          userProfile.userPhotoURL,
          userProfile.phoneNumber
        );
        // USER PROFILE DATA

        // IF USER IS AUTHENTICATED
        // IF USER IS AUTHENTICATED
        if (loadedUserProfile.localId) {
          this.authService.getDBuser(loadedUserProfile);
          this.store.dispatch(
            AuthActions.setUserProfile({
              authType: userProfile.authType,
              displayName: userProfile.displayName,
              email: userProfile.email,
              localId: userProfile.localId,
              userPhotoURL: userProfile.userPhotoURL,
              phoneNumber: userProfile.phoneNumber,
            })
          );
          console.log('setUserProfile called in autoLogin');
        }

        if (loadedUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return AuthActions.authSuccess({
            signInMethod: loadedUserProfile.authType,
            email: loadedUser.email,
            localId: loadedUser.localId,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            displayName: loadedUserProfile.displayName,
            firstName: loadedUser.firstName,
            lastName: loadedUser.lastName,
            userPhotoURL: loadedUserProfile.userPhotoURL,
            phoneNumber: loadedUserProfile.phoneNumber,
            redirect: false,
          });
          // IF USER IS AUTHENTICATED
        }
        // IF NO USER IS AUTHENTICATED. . . .
        return { type: 'user not authenticated' };
      })
    )
  );

  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          signOut(this.auth);
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userAuthData');
          localStorage.removeItem('userProfile');
          this.router.navigate(['/']);
          console.log('USER WAS LOGGED OUT')
        })
      ),
    { dispatch: false }
  );

  constructor(
    private dialog: MatDialog,
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private auth: Auth,
    private store: Store<fromAppStore.AppState>
  ) {}
}
