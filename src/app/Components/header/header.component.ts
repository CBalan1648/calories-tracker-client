import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserService } from 'src/app/Services/user.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userServiceSubscriptions: Subscription;
  private firstName: string;
  private lastName: string;
  private logout;

  @Input() private sidenavRef: any;

  constructor(private userService: UserService) {
    this.logout = userService.logoutUser.bind(this.userService);
  }

  ngOnInit() {
    this.userServiceSubscriptions = this.userService.getUserObservable().pipe(filter(user => user)).subscribe(user => {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
    });
  }

  ngOnDestroy() {
    this.userServiceSubscriptions.unsubscribe();
  }

}
