import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from './Services/user.service';
import { Router } from '@angular/router';
import { User } from './Models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private readonly router: Router,
              private readonly userService: UserService) { }

  private userServiceSubscriptions: Subscription;
  private showSideBar: boolean;
  private user: User;

  title = 'calories-tracker-FE';

  ngOnInit() {
    this.userServiceSubscriptions = this.userService.getUserObservable().subscribe(user => {
      this.user = user;
      this.showSideBar = !!user;
    });
  }

  isSuperUser(authLevel) {
    // FOR DEV PURPOSE
    return true;
    return authLevel === 'USER_MANAGER' || authLevel === 'ADMIN';
  }

  ngOnDestroy() {
    this.userServiceSubscriptions.unsubscribe();
  }

  redirectToHome() {
    this.router.navigate(['/home']);
  }

}
