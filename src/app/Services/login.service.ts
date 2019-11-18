import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { retry, take, tap } from 'rxjs/operators';
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
    this.http.post<any>('http://localhost:3000/users/login', userData).pipe(retry(3), take(1)).subscribe(response => {
      console.log(this);
      this.userService.updateUser(response);
      this.router.navigate(['/home']);
    });
  }
}
