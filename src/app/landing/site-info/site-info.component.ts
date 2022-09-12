import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromAppStore from '../../app-store/app.reducer';
import * as AuthActions from '../../auth/auth-store/auth.actions';

import { AuthService } from 'src/app/auth/auth-control/auth.service';
import { map } from 'rxjs/operators';
import { AppService } from 'src/app/app-service/app.service';

@Component({
  selector: 'app-site-info',
  templateUrl: './site-info.component.html',
})
export class SiteInfoComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  githubUrl: string;

  private userAuthSub: Subscription;
  private githubDataSub: Subscription;

  constructor(
    private authService: AuthService,
    private store: Store<fromAppStore.AppState>,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.githubDataSub = this.appService
      .getGithubData()
      .pipe(map((ghData) => ghData.repos_url))
      .subscribe((repos) => (this.githubUrl = repos));

    this.userAuthSub = this.store
      .select('auth')
      .pipe(map((authState) => authState.userAuth))
      .subscribe((user) => {
        this.isAuthenticated = !!user;
      });
  }

  onOpenAuth(mode: string) {
    this.authService.openAuthForm(mode);
  }

  ngOnDestroy(): void {
    this.userAuthSub.unsubscribe();
  }
}
