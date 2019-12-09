import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { retry, take } from 'rxjs/operators';
import { apiAddress } from '../config';
import { LoginService } from './login.service';
import { TopNotificationService } from './top-notification.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient, private loginService: LoginService, private notification: TopNotificationService) { }

  connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.subscribe(registerRequest => {
      const [newUserData, autologin] = registerRequest;
      this.registerUserRequest(newUserData, !!autologin);
    });
  }

  disconnectRequestObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  registerUserRequest(userData, autologin = false) {
    this.http.post<any>(`${apiAddress}/api/users/`, userData, { observe: 'response' }).pipe(
      retry(3),
      take(1)
    ).subscribe(response => {
      if (response.status === 201 && autologin) {
        this.loginService.loginUserRequest({ email: userData.email, password: userData.password });
      }
    });
  }
}
