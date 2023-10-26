import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UserForLogin } from '../models/auth/userForLogin';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedRole = route.data.expectedRole;

    if (this.authService.isLoggedIn) {
      let user: UserForLogin = this.authService.getUser()!;
      console.log(user);
      console.log(this.authService.hasRole(user, expectedRole))
      if (this.authService.hasRole(user, expectedRole)) {
        return true;
      } else {
        this.router.navigate([""]);
        this.toastrService.warning("You are not authorised to acess this page", "Unauthorised");
        return false;
      }
    } else {
      return false;
    }
  }
}

