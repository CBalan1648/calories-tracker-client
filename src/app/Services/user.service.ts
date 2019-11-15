import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

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
}
