import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromAppStore from './app-store/app.reducer';
import * as AuthActions from './auth/auth-store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<fromAppStore.AppState>
  ) {}

  ngOnInit() {
    this.store.dispatch(AuthActions.autoLogin());
  }
}
