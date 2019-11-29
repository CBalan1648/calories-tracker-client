import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, retry, take, filter } from 'rxjs/operators';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private usersBehaviourSubject = new BehaviorSubject<any>(null);
  private usersObservable = this.usersBehaviourSubject.asObservable();

  private currentFilterSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ searchString: '', searchAuthLevel: '' });
  public currentFilter: Observable<any> = this.currentFilterSubject.asObservable();

  public currentFilteredUsers: Observable<any[]> = combineLatest(this.usersObservable, this.currentFilter).pipe(
    filter(([ob1, ob2]) => !!ob1 && !!ob2),
    map(filterUsers)
  );

  constructor(private http: HttpClient) { }

  public getUserObservable() {
    return this.currentFilteredUsers;
  }

  connectEditUserRequestObservable(observable: Observable<any>): Subscription {
    return observable.subscribe(userData => {
      this.putRequest.call(this, userData);
    });
  }

  disconnectObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }


  connectFilterObservable(observable: Observable<any>): Subscription {
    return observable.subscribe((filterValue) => { this.currentFilterSubject.next(filterValue); });
  }

  disconnectFilterObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  clearFilterObservable(): void {
    this.currentFilterSubject.next({searchString : '', searchAuthLevel : ''});
  }

  getFilterObservable() {
    return this.currentFilter;
  }

  public getUsers(): void {
    this.http.get('http://localhost:3000/api/users').pipe(
      retry(3),
      take(1),
    ).subscribe(users => {
      this.usersBehaviourSubject.next(users);
    });
  }

  deleteRequest(userId) {
    this.http.delete<any>(`http://localhost:3000/api/users/${userId}`, { observe: 'response' }).pipe(
      retry(3),
      take(1)
    ).subscribe(response => {
      if (response.body.deletedCount === 1) {
        this.getUserObservable().pipe(take(1)).subscribe(currentUsersArray => {
          const updatedUsersArray = currentUsersArray.filter(user => user._id !== userId);
          this.usersBehaviourSubject.next(updatedUsersArray);
        });
      }
    });
  }

  putRequest(userData) {
    console.log('USERDATA', userData);
    const { token, email, _id, ...updateData } = userData;
    this.http.put<any>(`http://localhost:3000/api/users/${userData._id}`, updateData, { observe: 'response' }).pipe(
      retry(3),
      take(1),
    ).subscribe((response: any) => {
      if (response.body.nModified === 1) {
        console.log('SUCCESS UPDATED');
        this.usersObservable.pipe(take(1)).subscribe(currentUserArray => {
          const updatedUserIndex = currentUserArray.findIndex(arrayElement => arrayElement._id === userData._id);
          const updatedArray = [...currentUserArray];
          updatedArray.splice(updatedUserIndex, 1, userData);

          this.usersBehaviourSubject.next(updatedArray);
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
