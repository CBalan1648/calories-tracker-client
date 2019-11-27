import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from 'src/app/Services/admin.service';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/Models/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  private usersObservable: Observable<User[]>;
  private usersSubscription: Subscription;
  private users: User[] = null;

  constructor(private readonly adminService: AdminService) {

    this.usersObservable = adminService.getUserObservable();
    adminService.getUsers();
  }

  ngOnInit() {
    this.usersSubscription = this.usersObservable.subscribe(users => {
      this.users = users;
      console.log(users);
    });
  }

  getData() {
    
  }

  log(event) {
    return [
      {title : "meal ", _id : "asd", description : "not a description", calories : 412, time : 1124122412, overCal : false},
      {title : "meal ", _id : "asd", description : "not a description", calories : 412, time : 1124122412, overCal : false}
    ]
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

}
