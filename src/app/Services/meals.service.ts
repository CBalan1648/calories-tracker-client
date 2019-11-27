import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable, Subscription } from 'rxjs';
import { filter, groupBy, map, mergeMap, reduce, retry, take, tap } from 'rxjs/operators';
import { Meal } from '../Models/meal';
import { User } from '../Models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  private user: User;

  private observablesMap: Map<string, BehaviorSubject<any>> = new Map()



  private currentFilterSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentFilter: Observable<Meal[]> = this.currentFilterSubject.asObservable();

  public currentFilteredMeals: Observable<any[]>;

  public currentFilteredAndGroupedMeals: Observable<any[]>;

  constructor(private http: HttpClient, userService: UserService) {

    userService.getUserObservable().subscribe(user => {
      this.currentFilteredMeals = combineLatest(this.getRawObservable(user._id), this.currentFilter).pipe(map(filterMeals));
      this.user = user
      this.currentFilteredAndGroupedMeals = combineLatest(this.currentFilteredMeals, userService.getUserObservable()).pipe(
        tap(console.log),
        filter(([ob1, ob2]) => !!ob1 && !!ob2),
        mergeMap(updateMealWithCalories));
    });
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
    this.http.post<any>(`http://localhost:3000/api/users/${this.user._id}/meals/`, mealData, { observe: 'response' }).pipe(
      retry(3),
      take(1)
    ).subscribe(response => {
      if (response.status === 201) {
        this.getRawObservable(this.user._id).pipe(take(1)).subscribe(currentMealsArray => {
          const updatedArray = [...currentMealsArray];
          updatedArray.push(response.body);
          this.getBehaviourSubject(this.user._id).next(updatedArray);
        });
      }
    });
  }

  getRawObservable(userId) {
    return this.getBehaviourSubject(userId).asObservable();
  }

  getBehaviourSubject(userId = this.user && this.user._id || 'null') {
    if (!this.observablesMap.has(userId)) {
      this.observablesMap.set(userId, new BehaviorSubject<any>(null))
    }
    return this.observablesMap.get(userId)
  }

  getFilteredObservable() {
    return this.currentFilteredAndGroupedMeals;
  }

  deleteMeal(mealId): void {
    this.http.delete(`http://localhost:3000/api/users/${this.user._id}/meals/${mealId}`).pipe(
      retry(3),
      take(1),
    ).subscribe((response: { n: number, nModified: number, ok: number }) => {
      if (response.nModified === 1) {
        this.getRawObservable(this.user._id).pipe(take(1)).subscribe(currentMealsArray => {
          const updatedArray = currentMealsArray.filter(meal => meal._id !== mealId);
          this.getBehaviourSubject(this.user._id).next(updatedArray);
        });
      }
    });
  }

  updateMeal(updatedMeal): void {
    this.http.put(`http://localhost:3000/api/users/${this.user._id}/meals/${updatedMeal._id}`, updatedMeal).pipe(
      retry(3),
      take(1),
    ).subscribe((response: { n: number, nModified: number, ok: number }) => {
      if (response.nModified === 1) {
        this.getRawObservable(this.user._id).pipe(take(1)).subscribe(currentMealsArray => {

          const updatedMealIndex = currentMealsArray.findIndex(arrayElement => arrayElement._id === updatedMeal._id);
          const updatedArray = [...currentMealsArray];
          updatedArray.splice(updatedMealIndex, 1, updatedMeal);

          this.getBehaviourSubject(this.user._id).next(updatedArray);
        });
      }
    });
  }

  public getMeals(userId = this.user._id): void {
    this.http.get(`http://localhost:3000/api/users/${userId}/meals`).pipe(
      retry(3),
      take(1),
      map((responseData: { _id: string, meals: Meal[] }) => responseData.meals)
    ).subscribe(meals => {
      console.log(meals)
      this.getBehaviourSubject(userId).next(meals);
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
