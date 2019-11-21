import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, retry, take, tap } from 'rxjs/operators';
import { Meal } from '../Models/meal';

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  private currentMealsSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentMeals: Observable<Meal[]> = this.currentMealsSubject.asObservable().pipe(tap(console.log));

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
    this.http.post<any>('http://localhost:3000/meals/', mealData, { observe: 'response' }).pipe(retry(3), take(1)).subscribe(response => {
      if (response.status === 201) {
        this.currentMeals.pipe(take(1)).subscribe(currentMealsArray => {
          const updatedArray = [...currentMealsArray];
          updatedArray.push(response.body);
          this.currentMealsSubject.next(updatedArray);
        });
      }
    });
  }

  getObservable() {
    return this.currentMeals;
  }

  deleteMeal(mealId): void {
    this.http.delete(`http://localhost:3000/meals/${mealId}`).pipe(
      retry(3),
      take(1),
    ).subscribe((response: { n: number, nModified: number, ok: number }) => {
      console.log(response);
      if (response.nModified === 1) {
        this.currentMeals.pipe(take(1)).subscribe(currentMealsArray => {
          const updatedArray = currentMealsArray.filter(meal => meal._id !== mealId);
          this.currentMealsSubject.next(updatedArray);
        });
      }
    });
  }

  updateMeal(updatedMeal): void {
    this.http.put('http://localhost:3000/meals', updatedMeal).pipe(
      retry(3),
      take(1),
    ).subscribe((response: { n: number, nModified: number, ok: number }) => {
      if (response.nModified === 1) {
        this.currentMeals.pipe(take(1)).subscribe(currentMealsArray => {

          const updatedMealIndex = currentMealsArray.findIndex(arrayElement => arrayElement._id === updatedMeal._id);
          const updatedArray = [...currentMealsArray];
          updatedArray.splice(updatedMealIndex, 1, updatedMeal);

          this.currentMealsSubject.next(updatedArray);
        });
      }
    });
  }

  public getMeals(): void {
    this.http.get('http://localhost:3000/meals').pipe(
      retry(3),
      take(1),
      map((responseData: { _id: string, meals: Meal[] }) => responseData.meals)
    ).subscribe(meals => {
      this.currentMealsSubject.next(meals);
    });
  }
}


