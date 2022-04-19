import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromAppStore from '../app-store/app.reducer';
import * as AuthActions from '../auth/auth-store/auth.actions';

import { AuthService } from '../auth/auth-control/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy, OnChanges {
  navbarCollapsed = true;
  isAuthenticated = false;
  userEmail: string;
  displayName: string;
  userPhoto: string;
  private userAuthSub: Subscription;
  private userProfileSub: Subscription;

  constructor(
    private authService: AuthService,
    private store: Store<fromAppStore.AppState>
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit() {
    this.userAuthSub = this.store
    .select('auth')
    .pipe(map((authState) => authState.userAuth))
    .subscribe((userAuth) => {
      this.isAuthenticated = !!userAuth;
      if (this.isAuthenticated) {
        this.userEmail = userAuth.email;
      }
    });

    this.userProfileSub = this.store
    .select('auth')
    .pipe(map((authState) => authState.userProfile))
    .subscribe((userProfile) => {
      if(this.isAuthenticated && (userProfile.displayName !== null)) {
        this.displayName = userProfile.displayName;
      }
      if ( this.isAuthenticated && (userProfile.authType === 'google.com') && (userProfile.userPhotoURL !== null)) {
        this.userPhoto =  userProfile.userPhotoURL;
      }
    })

  }

  toggleCollapsedHeader() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  onOpenAuth(mode: string) {
    this.authService.openAuthForm(mode);
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }

  ngOnDestroy(): void {
      this.userAuthSub.unsubscribe();
      this.userProfileSub.unsubscribe();
  }

}
