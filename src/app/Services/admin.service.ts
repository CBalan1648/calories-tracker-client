import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { retry, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private usersBehaviourSubject = new BehaviorSubject<any>(null);
  private usersObservable = this.usersBehaviourSubject.asObservable();

  constructor(private http: HttpClient) { }

  public getUserObservable() {
    return this.usersObservable;
  }

  connectEditUserRequestObservable(observable: Observable<any>): Subscription {
    return observable.subscribe(userData => {
      this.putRequest.call(this, userData);
    });
  }

  disconnectObservable(subscription: Subscription): void {
    subscription.unsubscribe();
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
