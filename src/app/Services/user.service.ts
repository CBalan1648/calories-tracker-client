import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { take, tap, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  public updateUser(user) {
    this.currentUserSubject.next(user);
  }

  public getUserObservable(): Observable<any> {
    return this.currentUser;
  }

  public logoutUser() {
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  public updateCalories(calories: number) {
    this.currentUser.pipe(take(1)).subscribe(user => {
      user.targetCalories = calories;
      this.currentUserSubject.next(user);
    });
  }

  connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.subscribe(updateBody => {
      this.putRequest.call(this, updateBody);
    });
  }

  disconnectRequestObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  putRequest(userData) {
    const {token, email, _id, ...updateData} = userData; 
    this.http.put<any>(`http://localhost:3000/api/users/${userData._id}`, updateData, { observe: 'response' }).pipe(
      retry(3),
      take(1)
    ).subscribe( response  => {
      if (response.body.nModified === 1) {
        this.updateUser(userData);
      }
    });
  }
}
