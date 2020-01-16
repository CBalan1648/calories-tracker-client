import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, ObservableInput, Subscription } from 'rxjs';
import { catchError, filter, map, retryWhen, take } from 'rxjs/operators';
import { apiAddress } from '../config';
import { filterUsers, updateUserInArray } from '../helpers/functions.static';
import { requestRetryStrategy } from '../helpers/request-retry.strategy';
import { ResponseHandlerService } from './response-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private usersSubject = new BehaviorSubject<any>(null);
  private filterSubject = new BehaviorSubject<any>({ searchString: '', searchAuthLevel: '' });

  public currentFilteredUsers: Observable<any[]> = combineLatest(this.usersSubject.asObservable(), this.filterSubject.asObservable()).pipe(
    filter(([userObservableData, filterObservableData]) => !!userObservableData && !!filterObservableData),
    map(filterUsers)
  );

  constructor(private http: HttpClient,
              private responseHandlerService: ResponseHandlerService) { }

  public getUserObservable() {
    return this.currentFilteredUsers;
  }

  public connectEditUserRequestObservable(observable: Observable<any>): Subscription {
    return observable.subscribe(userData => {
      this.updateUserRequest.call(this, userData);
    });
  }

  public connectFilterObservable(observable: Observable<any>): Subscription {
    return observable.subscribe((filterValue) => { this.filterSubject.next(filterValue); });
  }

  public disconnectObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  public clearFilterObservable(): void {
    this.filterSubject.next({ searchString: '', searchAuthLevel: '' });
  }

  public getFilterObservable() {
    return this.filterSubject.asObservable();
  }

  private informUserOfError(error, caught): ObservableInput<any> {
    this.responseHandlerService.handleResponseCode('user', error.status);
    throw error;
  }

  private handleGetUserResponse(responseBody) {
    this.usersSubject.next(responseBody);
  }

  private handleDeleteUserResponse(userId, response) {
    if (response.body.deletedCount === 0) { return void 0; }

    this.getUserObservable().pipe(take(1)).subscribe((currentUserArray) => {
      this.usersSubject.next(currentUserArray.filter(user => user._id !== userId));
    });
  }

  public getUsers(): void {
    this.http.get(`${apiAddress}/api/users`).pipe(
      retryWhen(requestRetryStrategy()),
      catchError(this.informUserOfError.bind(this)),
      take(1),
    ).subscribe(this.handleGetUserResponse.bind(this));
  }

  public deleteUserRequest(userId) {
    this.http.delete<any>(`${apiAddress}/api/users/${userId}`, { observe: 'response' }).pipe(
      retryWhen(requestRetryStrategy()),
      catchError(this.informUserOfError.bind(this)),
      take(1)
    ).subscribe(this.handleDeleteUserResponse.bind(this, userId));
  }

  public updateUserRequest(userData) {
    const { token, email, _id, ...updateData } = userData;
    this.http.put<any>(`${apiAddress}/api/users/${userData._id}`, updateData, { observe: 'response' }).pipe(
      retryWhen(requestRetryStrategy()),
      catchError(this.informUserOfError.bind(this)),
      take(1),
    ).subscribe(this.handleUpdateUserResponse.bind(this, userData));
  }

  private handleUpdateUserResponse(userData, response) {
    if (response.body.nModified === 0) { return void 0; }
    this.usersSubject.asObservable().pipe(take(1)).subscribe((currentUserArray) => {
      this.usersSubject.next(updateUserInArray(userData, currentUserArray));
    });
  }
}

