import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { retry, take, tap } from 'rxjs/operators';
import { User } from '../Models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.pipe(
      tap(this.postRequest.bind(this)),
    ).subscribe();
  }

  disconnectRequestObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  postRequest(userData) {
    this.http.post<any>('http://localhost:3000/api/users/login', userData).pipe(retry(3), take(1)).subscribe(response => {
      const [responseUserData, valid] = getTokenData(response.access_token);
      if (valid) {
        responseUserData.token = response.access_token;
        this.userService.updateUser(responseUserData);
        this.router.navigate(['/home']);
      }
    });
  }
}

const getTokenData = (token: string): [User | null, boolean] => {
  try {
    const tokenInfoJson = atob(token.split('.')[1]);
    const tokenInfo = JSON.parse(tokenInfoJson);
    return [tokenInfo.user, true];
  } catch (e) {
    return [null, false];
  }
};
