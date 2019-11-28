import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
}
