import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, retry, take } from 'rxjs/operators';
import { apiAddress } from '../config';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private usersSubject = new BehaviorSubject<any>(null);
  private filterSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ searchString: '', searchAuthLevel: '' });

  public currentFilteredUsers: Observable<any[]> = combineLatest(this.usersSubject.asObservable(), this.filterSubject.asObservable()).pipe(
    filter(([ob1, ob2]) => !!ob1 && !!ob2),
    map(filterUsers)
  );

  constructor(private http: HttpClient) { }

  public getUserObservable() {
    return this.currentFilteredUsers;
  }

  connectEditUserRequestObservable(observable: Observable<any>): Subscription {
    return observable.subscribe(userData => {
      this.updateUserRequest.call(this, userData);
    });
  }

  connectFilterObservable(observable: Observable<any>): Subscription {
    return observable.subscribe((filterValue) => { this.filterSubject.next(filterValue); });
  }

  disconnectObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  clearFilterObservable(): void {
    this.filterSubject.next({ searchString: '', searchAuthLevel: '' });
  }

  getFilterObservable() {
    return this.filterSubject.asObservable();
  }

  public getUsers(): void {
    this.http.get(`${apiAddress}/api/users`).pipe(
      retry(3),
      take(1),
    ).subscribe(users => {
      this.usersSubject.next(users);
    });
  }

  deleteUserRequest(userId) {
    this.http.delete<any>(`${apiAddress}/api/users/${userId}`, { observe: 'response' }).pipe(
      retry(3),
      take(1)
    ).subscribe(response => {
      if (response.body.deletedCount === 1) {
        this.getUserObservable().pipe(take(1)).subscribe(currentUsersArray => {
          const updatedUsersArray = currentUsersArray.filter(user => user._id !== userId);
          this.usersSubject.next(updatedUsersArray);
        });
      }
    });
  }

  updateUserRequest(userData) {
    const { token, email, _id, ...updateData } = userData;
    this.http.put<any>(`${apiAddress}/api/users/${userData._id}`, updateData, { observe: 'response' }).pipe(
      retry(3),
      take(1),
    ).subscribe((response: any) => {
      if (response.body.nModified === 1) {
        this.usersSubject.asObservable().pipe(take(1)).subscribe(currentUserArray => {
          const updatedUserIndex = currentUserArray.findIndex(arrayElement => arrayElement._id === userData._id);
          const updatedArray = [...currentUserArray];
          updatedArray.splice(updatedUserIndex, 1, userData);

          this.usersSubject.next(updatedArray);
        });
      }
    });
  }
}

const filterUsers = ([usersArray, filterData]) => {
  if (!filterData) { return usersArray; }

  return usersArray.filter((user: User) => {
    return (filterData.searchString ? containString(user.firstName, user.lastName, user.email, filterData.searchString) : true) &&
      (filterData.searchAuthLevel ? filterLevel(user.authLevel, filterData.searchAuthLevel) : true);
  });

};

const containString = (testFirstName, testLastName, testEmail, searchString) => {

  const lowerCaseSearch = searchString.toLowerCase();

  return testFirstName.toLowerCase().includes(lowerCaseSearch) ||
    testLastName.toLowerCase().includes(lowerCaseSearch) ||
    testEmail.toLowerCase().includes(lowerCaseSearch);
};

const filterLevel = (userAuthLevel, searchAuthLevel) => userAuthLevel === searchAuthLevel;
