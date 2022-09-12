import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Rise_FadeUp } from '../app.animations';

import { Store } from '@ngrx/store';
import * as fromAppStore from '../app-store/app.reducer';

import { AppService } from '../app-service/app.service';
import { map } from 'rxjs/operators';
import { GithubResponseData } from '../app-service/GithubResponseData.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  animations: [Rise_FadeUp],
})
export class LandingComponent implements OnInit, OnDestroy {
  isLoading = false;
  isAuthenticated = false;
  displayName: string;
  lastUpdated: Date;
  userEmail: string;
  userPhoto: string;
  error: string = null;

  githubData: GithubResponseData;

  private userAuthSub: Subscription;
  private userProfileSub: Subscription;
  private githubDataSub: Subscription;

  constructor(
    private appService: AppService,
    private store: Store<fromAppStore.AppState>
  ) {}

  ngOnInit() {
    this.githubDataSub = this.appService
      .getGithubData()
      .subscribe((gh) => (this.githubData = gh));

    this.appService.getLastUpdate();
    this.lastUpdated = this.appService.lastUpdated;

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
        if (this.isAuthenticated && userProfile.displayName !== null) {
          this.displayName = userProfile.displayName;
        }
        if (
          this.isAuthenticated &&
          userProfile.authType === 'google.com' &&
          userProfile.userPhotoURL !== null
        ) {
          this.userPhoto = userProfile.userPhotoURL;
        }
      });
  }

  ngOnDestroy() {
    this.userAuthSub.unsubscribe();
    this.userProfileSub.unsubscribe();
    this.githubDataSub.unsubscribe();
  }
}
