import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { retry, take, tap } from 'rxjs/operators';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient, private loginService: LoginService) { }

  connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.subscribe(registerRequest => {
      const [newUserData, autologin] = registerRequest;
      this.postRequest(newUserData, !!autologin)
    });
  }

  disconnectRequestObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  postRequest(userData, autologin = false) {
    this.http.post<any>('http://localhost:3000/api/users/', userData, { observe: 'response' }).pipe(
      retry(3),
      take(1)
    ).subscribe(response => {
      if (response.status === 201 && autologin) {
        this.loginService.postRequest({ email: userData.email, password: userData.password });
      }
    });
  }
}
