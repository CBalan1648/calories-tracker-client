import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { retry, take } from 'rxjs/operators';
import { apiAddress } from '../config';

const emptyUser = { _id: undefined };

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(emptyUser);

  constructor(private http: HttpClient, private router: Router) { }

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

  connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.subscribe(updateBody => {
      this.editUserRequest.call(this, updateBody);
    });
  }

  disconnectRequestObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  editUserRequest(userData) {
    const { token, email, _id, ...updateData } = userData;
    this.http.put<any>(`${apiAddress}/api/users/${userData._id}`, updateData, { observe: 'response' }).pipe(
      retry(3),
      take(1)
    ).subscribe(response => {
      if (response.body.nModified === 1) {
        this.updateUser(userData);
      }
    });
  }
}
