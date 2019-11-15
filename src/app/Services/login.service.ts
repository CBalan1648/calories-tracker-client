import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, Subject } from 'rxjs';
import { tap, retry, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.pipe(
      tap(this.postRequest.bind(this)),
      tap(console.log)
    ).subscribe();

  }

  disconnectRequestObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  postRequest(userData) {
    this.http.post<any>('localhost:3000/users/authenticate', userData).pipe(retry(3), take(1)).subscribe(response => {
      console.log(this);
      this.userService.updateUser(response);
      this.router.navigate(['/home']);
    });
  }
}
