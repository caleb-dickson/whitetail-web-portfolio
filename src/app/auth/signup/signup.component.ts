import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromAppStore from '../../app-store/app.reducer';
import * as AuthActions from '../../auth/auth-store/auth.actions';

import { AuthResponseData, AuthService } from '../auth-control/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  error: string;

  private storeSub: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private store: Store<fromAppStore.AppState>
  ) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    })
  }

  onSignup(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const saveNewUser = true;
    const firstName = form.value.firstName;
    const lastName = form.value.lastName;
    const displayName = firstName + ' ' + lastName;
    const phoneNumber = form.value.phoneNumber;
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    this.store.dispatch(
      AuthActions.emailPassSignupStart({
        saveNewUser: saveNewUser,
        signInMethod: null,
        firstName: firstName,
        lastName: lastName,
        displayName: displayName,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        userPhotoURL: null,
        returnSecureToken: true,
      })
    );

    form.reset();
  }

  googleLogin() {
    this.isLoading = true;
    this.dialog.closeAll();
    this.store.dispatch(AuthActions.googleLoginStart());
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
      this.error = null;
    }
  }

}
