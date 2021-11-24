import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './Authentication.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public auth: AuthenticationService, public router: Router) { }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['unAuth']);
      return false;
    }
    return true;
  }
}
