import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { retry, take, map } from 'rxjs/operators';

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
}
