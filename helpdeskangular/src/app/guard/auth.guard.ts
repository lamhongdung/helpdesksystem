import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationType } from '../enum/NotificationType.enum';
import { AuthService } from '../service/auth.service';
import { NotificationService } from '../service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router,
    private notificationService: NotificationService) {

  }

  // return:
  //    - true: allow access the page
  //    - false: do not allow to access the page
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    let url: string = state.url;

    // check whether user already logged in or not?
    if (this.isUserLoggedIn()) {

      let role = this.authService.getRoleFromLocalStorage();

      // if role is not correct
      // if (route.data.roles.indexOf(role) === -1) {
      if (route.data['roles'].indexOf(role) === -1) {

        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });

        return false;

      }

      return true;
    }

    // if user has not yet logged in then re-direct to the "login" page
    this.router.navigate(['/login']);

    this.notificationService.notify(NotificationType.ERROR, `You need to log in to access this page`);

    return false;

  }

  // 
  private isUserLoggedIn(): boolean {

    // if user logged in then return true(means allow to access the page)
    if (this.authService.isLoggedInUser()) {

      return true;

    }

    return false;
  }

}