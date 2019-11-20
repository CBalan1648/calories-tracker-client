import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { retry, take, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  private currentMealsSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentMeals: Observable<any> = this.currentMealsSubject.asObservable();

  constructor(private http: HttpClient) { }

  connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.pipe(
      tap(console.log),
      tap(this.postRequest.bind(this)),
    ).subscribe();

  }

  disconnectRequestObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  postRequest(mealData) {
    this.http.post<any>('http://localhost:3000/meals/', mealData).pipe(retry(3), take(1)).subscribe(response => {
      console.log(response.status)
      if (response.status === 200) {
        this.getMeals()
      }
    });
  }

  getObservable() {
    return this.currentMeals;
  }

  public getMeals() : void {
     this.http.get('http://localhost:3000/meals').pipe(
      retry(3),
      take(1),
      map(responseData =>  responseData.meals)
    ).subscribe(meals => {
      this.currentMealsSubject.next(meals);
    });
  }
}


