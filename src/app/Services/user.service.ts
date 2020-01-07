import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, ObservableInput, Subscription } from 'rxjs';
import { catchError, retryWhen, take } from 'rxjs/operators';
import { apiAddress } from '../config';
import { requestRetryStrategy } from '../helpers/request-retry.strategy';
import { ResponseHandlerService } from './response-handler.service';

const emptyUser = { _id: undefined };

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(emptyUser);

  constructor(private http: HttpClient,
              private router: Router,
              private responseHandlerService: ResponseHandlerService) { }

  public updateUser(user) {
    this.currentUserSubject.next(user);
  }

  public getUserObservable(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  public logoutUser() {
    this.currentUserSubject.next(emptyUser);
    this.router.navigate(['/login']);
  }

  public updateCalories(calories: number) {
    this.currentUserSubject.asObservable().pipe(take(1)).subscribe(user => {
      user.targetCalories = calories;
      this.currentUserSubject.next(user);
    });
  }

  private informUserOfError(error, caught): ObservableInput<any> {
    this.responseHandlerService.handleResponseCode('meal', error.status);
    throw error;
  }

  public connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.subscribe(updateBody => {
      this.editUserRequest.call(this, updateBody);
    });
  }

  public disconnectRequestObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  private handleEditUserResponse(userData, response) {
    if (response.body.nModified === 1) {
      this.updateUser(userData);
    }
  }

  public editUserRequest(userData) {
    const { token, email, _id, ...updateData } = userData;
    this.http.put<any>(`${apiAddress}/api/users/${userData._id}`, updateData, { observe: 'response' }).pipe(
      retryWhen(requestRetryStrategy()),
      catchError(this.informUserOfError.bind(this)),
      take(1)
    ).subscribe(this.handleEditUserResponse.bind(this, userData));
  }
}
