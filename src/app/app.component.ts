import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from './Services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private readonly userService: UserService) { }

  private userServiceSubscriptions: Subscription;
  private showSideBar: boolean;

  title = 'calories-tracker-FE';

  ngOnInit() {
    this.userServiceSubscriptions = this.userService.getUserObservable().subscribe(user => {
      this.showSideBar = !!user;
    });
  }

  ngOnDestroy() {
    this.userServiceSubscriptions.unsubscribe();
  }

}
