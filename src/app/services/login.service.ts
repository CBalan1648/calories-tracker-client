import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ObservableInput, Subscription } from 'rxjs';
import { catchError, retryWhen, take, tap } from 'rxjs/operators';
import { apiAddress } from '../config';
import { getTokenData, saveToken } from '../helpers/functions.static';
import { requestRetryStrategy } from '../helpers/request-retry.strategy';
import { ResponseHandlerService } from './response-handler.service';
import { JWT_LOGIN_NOTIFICATION, TopNotificationService } from './top-notification.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,
              private router: Router,
              private userService: UserService,
              private responseHandlerService: ResponseHandlerService,
              private topNotificationService: TopNotificationService) {
                this.verifyToken();
               }

  public connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.pipe(
      tap(this.loginUserRequest.bind(this)),
    ).subscribe();

  }

  public disconnectRequestObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  private informUserOfError(error, caught): ObservableInput<any> {
    this.responseHandlerService.handleResponseCode('user', error.status);
    throw error;
  }

  private handleLoginResponse(response) {
    const [responseUserData, valid] = getTokenData(response.body.access_token);
    if (valid) {
      saveToken(response.body.access_token);
      responseUserData.token = response.body.access_token;
      this.userService.updateUser(responseUserData);
      this.router.navigate(['/home']);
    }
  }

  public loginUserRequest(userData) {
    this.http.post<any>(`${apiAddress}/api/login`, userData, { observe: 'response' }).pipe(
      retryWhen(requestRetryStrategy()),
      catchError(this.informUserOfError.bind(this)),
      take(1)
    ).subscribe(this.handleLoginResponse.bind(this));
  }

  public verifyToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.topNotificationService.setMessage(JWT_LOGIN_NOTIFICATION);
      this.http.post<any>(`${apiAddress}/api/token`, {access_token : token}, { observe: 'response' }).pipe(
        retryWhen(requestRetryStrategy()),
        catchError(this.informUserOfError.bind(this)),
        take(1)
      ).subscribe(this.handleLoginResponse.bind(this));
    }
  }
}
