import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromAppStore from '../../app-store/app.reducer';

import { AuthService } from 'src/app/auth/auth-control/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  isAuthenticated = false;
  userEmail: string;
  private userAuthSub: Subscription;

  constructor(
    private authService: AuthService,
    private store: Store<fromAppStore.AppState>
  ) {}

  ngOnInit(): void {
    this.userAuthSub = this.store
      .select('auth')
      .pipe(map((authState) => authState.userAuth))
      .subscribe((user) => {
        this.isAuthenticated = !!user;
        if (this.isAuthenticated) {
          this.userEmail = user.email;
        }
      });
  }

  ngOnDestroy(): void {
    this.userAuthSub.unsubscribe();
  }
}
