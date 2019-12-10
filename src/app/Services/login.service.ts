import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ObservableInput, Subscription } from 'rxjs';
import { catchError, retryWhen, take, tap } from 'rxjs/operators';
import { apiAddress } from '../config';
import { requestRetryStrategy } from '../Helpers/request-retry.strategy';
import { User } from '../Models/user';
import { ResponseHandlerService } from './response-handler.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,
              private router: Router,
              private userService: UserService,
              private responseHandlerService: ResponseHandlerService) { }

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
      responseUserData.token = response.body.access_token;
      this.userService.updateUser(responseUserData);
      this.router.navigate(['/home']);
    }
  }

  public loginUserRequest(userData) {
    this.http.post<any>(`${apiAddress}/api/users/login`, userData, { observe: 'response' }).pipe(
      retryWhen(requestRetryStrategy()),
      catchError(this.informUserOfError.bind(this)),
      take(1)
      ).subscribe(this.handleLoginResponse.bind(this));
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
