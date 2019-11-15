import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, Subject } from 'rxjs';
import { tap, retry, take } from 'rxjs/operators';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient, private loginService: LoginService) { }

  connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.pipe(tap(this.postRequest.bind(this))).subscribe();
  }

  disconnectRequestObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  postRequest(userData) {
    this.http.post<any>('localhost:3000/users/register', userData).pipe(retry(3), take(1)).subscribe(response => {
      if (response === 'OK') {
        this.loginService.postRequest({email : userData.email, password : userData.password});
      }
    });
  }
}
