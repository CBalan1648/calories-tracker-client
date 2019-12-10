import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableInput, Subscription } from 'rxjs';
import { catchError, retryWhen, take } from 'rxjs/operators';
import { apiAddress } from '../config';
import { requestRetryStrategy } from '../Helpers/request-retry.strategy';
import { LoginService } from './login.service';
import { ResponseHandlerService } from './response-handler.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient,
              private loginService: LoginService,
              private responseHandlerService: ResponseHandlerService) { }

  public connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.subscribe(registerRequest => {
      const [newUserData, autologin] = registerRequest;
      this.registerUserRequest(newUserData, !!autologin);
    });
  }

  public disconnectRequestObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  private informUserOfError(error, caught): ObservableInput<any> {
    this.responseHandlerService.handleResponseCode('meal', error.status);
    throw error;
  }

  private handleRegisterUserResponse(userData, autologin, response) {
    if (response.status === 201 && autologin) {
      this.loginService.loginUserRequest({ email: userData.email, password: userData.password });
    }
  }

  public registerUserRequest(userData, autologin = false) {
    this.http.post<any>(`${apiAddress}/api/users/`, userData, { observe: 'response' }).pipe(
      retryWhen(requestRetryStrategy()),
      catchError(this.informUserOfError.bind(this)),
      take(1)
    ).subscribe(this.handleRegisterUserResponse.bind(this, userData, autologin));
  }
}
