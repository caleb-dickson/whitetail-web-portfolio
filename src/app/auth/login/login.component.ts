import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromAppStore from '../../app-store/app.reducer';
import * as AuthActions from '../../auth/auth-store/auth.actions';

import { AuthService } from '../auth-control/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error: string = null;

  private storeSub: Subscription;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private store: Store<fromAppStore.AppState>
  ) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  onLogin(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const saveNewUser = false;
    const signupMethod = 'email-and-pass';
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    this.store.dispatch(
      AuthActions.emailPassLoginStart({
        saveNewUser: saveNewUser,
        signInMethod: signupMethod,
        email: email,
        password: password,
      })
    );
    form.reset();
  }

  googleLogin() {
    this.isLoading = true;
    this.dialog.closeAll();
    this.store.dispatch(AuthActions.googleLoginStart());

    // this.authService
    //   .loginWithGoogle()
    //   .then(() => {
    //     this.router.navigate(['/']);
    //     this.isLoading = false;
    //   })
    //   .catch((e) => (this.error = e.message));
  }
}
