import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private router: Router) { }

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
      user.calories = calories;
      this.currentUserSubject.next(user);
    });
  }
}
