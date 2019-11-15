import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { tap, mergeAll, retry, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.pipe(
      tap((userData) => { this.http.post<any>('localhost:3000/users/register', userData).pipe(retry(3), take(1)).subscribe(); }),
    ).subscribe();
  }

  deconnectRequestObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }
}
