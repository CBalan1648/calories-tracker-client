import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable, Subscription } from 'rxjs';
import { filter, groupBy, map, mergeMap, reduce, retry, take, tap } from 'rxjs/operators';
import { Meal } from '../Models/meal';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  private currentMealsSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentMeals: Observable<Meal[]> = this.currentMealsSubject.asObservable();

  private currentFilterSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentFilter: Observable<Meal[]> = this.currentFilterSubject.asObservable();

  public currentFilteredMeals: Observable<any[]> = combineLatest(this.currentMeals, this.currentFilter).pipe(map(filterMeals));

  public currentFilteredAndGroupedMeals: Observable<any[]>;

  constructor(private http: HttpClient, userService: UserService) {

    this.currentFilteredAndGroupedMeals = combineLatest(this.currentFilteredMeals, userService.getUserObservable()).pipe(
      filter(([ob1, ob2]) => !!ob1 && !!ob2),
      mergeMap(updateMealWithCalories));
  }

  connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.pipe(
      tap(this.postRequest.bind(this)),
    ).subscribe();

  }

  disconnectRequestObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  connectFilterObservable(observable: Observable<any>): Subscription {
    return observable.subscribe((filterValue) => { this.currentFilterSubject.next(filterValue); });

  }

  disconnectFilterObservable(subscription: Subscription): void {
    this.currentFilterSubject.next(null);
    subscription.unsubscribe();
  }

  postRequest(mealData) {
    this.http.post<any>('http://localhost:3000/api/meals/', mealData, { observe: 'response' }).pipe(retry(3), take(1)).subscribe(response => {
      if (response.status === 201) {
        this.currentMeals.pipe(take(1)).subscribe(currentMealsArray => {
          const updatedArray = [...currentMealsArray];
          updatedArray.push(response.body);
          this.currentMealsSubject.next(updatedArray);
        });
      }
    });
  }

  getRawObservable() {
    return this.currentMeals;
  }

  getObservable() {
    return this.currentFilteredAndGroupedMeals;
  }
 
  deleteMeal(mealId): void {
    this.http.delete(`http://localhost:3000/api/meals/${mealId}`).pipe(
      retry(3),
      take(1),
    ).subscribe((response: { n: number, nModified: number, ok: number }) => {
      if (response.nModified === 1) {
        this.currentMeals.pipe(take(1)).subscribe(currentMealsArray => {
          const updatedArray = currentMealsArray.filter(meal => meal._id !== mealId);
          this.currentMealsSubject.next(updatedArray);
        });
      }
    });
  }

  updateMeal(updatedMeal): void {
    this.http.put('http://localhost:3000/api/meals', updatedMeal).pipe(
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
    this.http.get('http://localhost:3000/api/meals').pipe(
      retry(3),
      take(1),
      map((responseData: { _id: string, meals: Meal[] }) => responseData.meals)
    ).subscribe(meals => {
      this.currentMealsSubject.next(meals);
    });
  }
}

const filterMeals = ([mealsArray, filterObject]) => {

  if (!filterObject) { return mealsArray; }

  return mealsArray.filter((meal: Meal) => {
    return (filterObject.stringSearch ?
      containString(meal.title, meal.description, filterObject.stringSearch) : true) &&
      (filterObject.timeSpan ?
        isInTimeSpan(meal.time, getTimeSpan(filterObject.timeSpan, filterObject.customDateFrom, filterObject.customDateTo)) : true) &&
      (filterObject.timeFrame ?
        isInTimeFrame(meal.time, getTimeFrame(filterObject.timeFrame, filterObject.frameBegin, filterObject.frameEnd)) : true);

  });
};

const getTimeSpan = (timeSpan, customDateFrom, customDateTo) => {
  const timeSpanOptions = {
    SPAN_LAST_24_HOURS: [Date.now() - 86400000, Date.now()],
    SPAN_LAST_7_DAYS: [Date.now() - 86400000 * 7, Date.now()],
    SPAN_LAST_30_DAYS: [Date.now() - 86400000 * 30, Date.now()],
    SPAN_CUSTOM: [Date.parse(customDateFrom) || 0, Date.parse(customDateTo) || Date.now()]
  };
  return timeSpanOptions[timeSpan];
};

const getTimeFrame = (timeFrame: string, frameBegin: string, frameEnd: string) => {
  const timeSpanOptions = {
    FRAME_BREAKFAST: ['07:00', '09:00'],
    FRAME_LUNCH: ['12:00', '14:00'],
    FRAME_DINNER: ['20:00', '22:00'],
    FRAME_CUSTOM: [frameBegin || '00:00', frameEnd || '23:59']
  };
  return timeSpanOptions[timeFrame];
};

const containString = (testTitleString, testDescriptionString, filterString) => {
  return testTitleString.toLowerCase().includes(filterString.toLowerCase()) ||
    testDescriptionString.toLowerCase().includes(filterString.toLowerCase());
};

const isInTimeSpan = (targetDate, [fromDate, toDate]) => targetDate >= fromDate && targetDate <= toDate;

const isInTimeFrame = (targetTime, [frameBegin, frameEnd]) => {
  const date = new Date(targetTime);
  const targetHour = date.getHours();
  const targetMinute = date.getMinutes();

  const [frameBeginHour, frameBeginMinute] = frameBegin.split(':').map(Number);
  const [frameEndHour, frameEndMinute] = frameEnd.split(':').map(Number);

  return (targetHour > frameBeginHour ||
    targetHour === frameBeginHour && targetMinute > frameBeginMinute) &&
    (targetHour < frameEndHour ||
      targetHour === frameEndHour && targetMinute < frameEndMinute);

};

const updateMealWithCalories = ([filteredMealsObservable, userObservable]) => {
  const tagetCalories = userObservable.targetCalories;

  return from([filteredMealsObservable]).pipe(
    mergeMap((mealArray: Meal[]) => from(mealArray).pipe(
      groupBy((meal: Meal) => {
        const mealDate = new Date(meal.time);
        return `${mealDate.getUTCDate()}-${mealDate.getUTCMonth()}-${mealDate.getUTCFullYear()}`;
      }),
      mergeMap((groupedMealsObservable: Observable<any>) => groupedMealsObservable.pipe(
        reduce((acc, cur) => [...acc, cur], []),
      )),
      map(groupedMeals => {
        const totCal = groupedMeals.reduce((totCalories, meal) => totCalories += meal.calories, 0);
        return groupedMeals.map(meal => ({ ...meal, overCal: totCal > tagetCalories }));
      }),
      reduce((acc, cur) => [...acc, ...cur], []),
    ))
  );
};
