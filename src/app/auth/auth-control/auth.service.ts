import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError, BehaviorSubject } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromAppStore from '../../app-store/app.reducer';
import * as AuthActions from '../auth-store/auth.actions';

import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

import {
  Firestore,
  addDoc,
  getDocs,
  collection,
  query,
  where,
} from '@angular/fire/firestore';

import { UserAuthData } from './user-auth.model';

import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { UserProfileData } from './user-profile.model';

export interface AuthResponseData {
  displayName: string;
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  userProfile: UserProfileData;
  private tokenExpirationTimer: any;

  constructor(
    private dialog: MatDialog,
    private auth: Auth,
    private firestore: Firestore,
    private store: Store<fromAppStore.AppState>
  ) {}

  setLogoutTimer(expirationDuration: number) {
    console.log('LOGOUT TIMER WAS SET');
    console.log(
      'You have ' +
        (expirationDuration / 1000 / 60).toFixed(0) +
        ' minutes remaining until auto-logout.'
    );
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(AuthActions.logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    console.log('CLEARED THE LOGOUT TIMER');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  openAuthForm(mode: string) {
    if (mode == 'login') {
      this.dialog.open(LoginComponent, {
        width: '40vh',
        height: '65vh',
        minWidth: 350,
        minHeight: 500,
      });
    }
    if (mode == 'signup') {
      this.dialog.open(SignupComponent, {
        width: '50vh',
        height: '90vh',
        minWidth: 350,
        minHeight: 750,
      });
    }
    this.store.dispatch(AuthActions.clearError());
  }

  async loginWithGoogle() {
    console.log('LOGIN WITH GOOGLE WAS CALLED');
    try {
      const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
      const credential = GoogleAuthProvider.credentialFromResult(result);
      this.handleGoogleAuth(
        result.providerId,
        result.user.displayName,
        result.user.email,
        result.user.uid,
        credential.idToken,
        (await result.user.getIdTokenResult()).issuedAtTime,
        (await result.user.getIdTokenResult()).expirationTime,
        result.user.photoURL,
        result.user.phoneNumber
      );
    } catch (error) {
      console.log(error);
      const errorMessage = error.message;
      this.handleError(errorMessage);
    }
  }

  private handleGoogleAuth(
    signInMethod: string,
    displayName: string,
    email: string,
    localId: string,
    token: string,
    loginTime: string,
    expiresOn: string,
    userPhotoURL: string,
    phoneNumber: string
  ) {
    console.log('HANDLE GOOGLE AUTH WAS CALLED');
    const loginTimeParse = new Date(loginTime).getTime();
    const expiresOnTimeParse = new Date(expiresOn).getTime();
    const expiresInSeconds = +expiresOnTimeParse - +loginTimeParse;
    const expirationDate = new Date(loginTimeParse + expiresInSeconds);
    const googleUser = new UserAuthData(
      signInMethod,
      email,
      localId,
      token,
      expirationDate,
      displayName,
      null,
      null,
      userPhotoURL,
      phoneNumber
    );
    localStorage.setItem('userAuthData', JSON.stringify(googleUser));
    this.setLogoutTimer(expiresInSeconds);
    this.getDBuser({
      authType: signInMethod,
      displayName: displayName,
      email: email,
      localId: localId,
      userPhotoURL: userPhotoURL,
      phoneNumber: phoneNumber,
    });
  }

  async getDBuser(user: any) {
    console.log('GET DB USER CALLED');
    try {
      let dbUserData: any;

      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('localId', '==', user.localId));

      const querySnapshot = await getDocs(q);
      const doesUserExistInDB = !querySnapshot.empty;
      console.log(
        'Is ' +
          user.email +
          ' in the Firestore database? ' +
          doesUserExistInDB +
          '!'
      );
      console.log();
      querySnapshot.forEach((doc) => {
        const dbUserID = doc.data().localId;
        dbUserData = doc.data();
      });

      if (!querySnapshot.empty) {
        this.userProfile = {
          authType: dbUserData.authType,
          displayName: dbUserData.displayName,
          email: dbUserData.email,
          localId: dbUserData.localId,
          userPhotoURL: dbUserData.userPhotoURL,
          phoneNumber: dbUserData.phoneNumber,
        };
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
        return (
          this.store.dispatch(
            AuthActions.setUserProfile({
              authType: dbUserData.authType,
              displayName: dbUserData.displayName,
              email: dbUserData.email,
              localId: dbUserData.localId,
              userPhotoURL: dbUserData.userPhotoURL,
              phoneNumber: dbUserData.phoneNumber,
            })
          ),
          this.store.dispatch(
            AuthActions.authSuccess({
              signInMethod: dbUserData.authType,
              email: dbUserData.email,
              localId: dbUserData.localId,
              token: user.token,
              expirationDate: user.expirationDate,
              displayName: user.displayName,
              firstName: user.firstName,
              lastName: user.lastName,
              phoneNumber: dbUserData.phoneNumber,
              userPhotoURL: dbUserData.userPhotoURL,
              redirect: true,
            })
          )
        );
      } else {
        this.saveNewUser(user);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.message;
      this.handleError(errorMessage);
    }
  }

  async saveNewUser(user: any) {
    console.log('saveNewUser() was called');

    try {
      const usersColl = collection(this.firestore, 'users');
      this.userProfile = {
        authType: user.authType,
        displayName: user.displayName,
        email: user.email,
        localId: user.localId,
        userPhotoURL: user.userPhotoURL,
        phoneNumber: user.phoneNumber,
      };
      addDoc(usersColl, this.userProfile);
      localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
      this.getDBuser(this.userProfile);
      return this.store.dispatch(
        AuthActions.setUserProfile({
          authType: user.authType,
          displayName: user.displayName,
          email: user.email,
          localId: user.localId,
          userPhotoURL: user.userPhotoURL,
          phoneNumber: user.phoneNumber,
        })
      );
    } catch (error) {
      console.log(error);
      const errorMessage = error.message;
      this.handleError(errorMessage);
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    let errorMessage = 'Unknown error';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
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
    return this.store.dispatch(AuthActions.authFail({ errorMessage }));
  }
}
