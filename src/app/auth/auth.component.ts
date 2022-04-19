import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth-control/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  constructor(private authService: AuthService, private router: Router) {}

  onOpenAuth(mode: string) {
    this.authService.openAuthForm(mode);
  }
}
