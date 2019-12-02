import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserService } from '../Services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private user;
  private observableSubscription: Subscription;

  constructor(private userService: UserService, private router: Router) {
    this.userService.getUserObservable().subscribe(user => this.user = user);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const roles = next.data.roles as Array<string>;

    console.log(this.user)

    if (!this.user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (this.user.authLevel && roles.includes(this.user.authLevel)) {
      return true;
    }

    if (this.user.authLevel) {
      this.router.navigate(['/home']);
      return false;
    }

    this.router.navigate(['/login']);
    return false;
  }

}
