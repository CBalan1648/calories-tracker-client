import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable, Subscription } from 'rxjs';
import { filter, groupBy, map, mergeMap, reduce, retry, take } from 'rxjs/operators';
import { apiAddress } from '../config';
import { Meal } from '../Models/meal';
import { User } from '../Models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  private user: User;
  private observablesMap: Map<string, BehaviorSubject<any>> = new Map();

  private currentFilterSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public currentFilteredMeals: Observable<any[]>;

  public currentFilteredAndGroupedMeals: Observable<any[]>;

  constructor(private http: HttpClient, userService: UserService) {

    userService.getUserObservable().subscribe(user => {
      this.currentFilteredMeals = combineLatest(this.getRawObservable(user._id), this.currentFilterSubject.asObservable()).pipe(
        map(filterMeals)
        );
      this.user = user;
      this.currentFilteredAndGroupedMeals = combineLatest(this.currentFilteredMeals, userService.getUserObservable()).pipe(
        filter(([ob1, ob2]) => !!ob1 && !!ob2),
        mergeMap(updateMealWithCalories));
    });
  }

  connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.subscribe(newMealData => {
      const [mealData, userId] = newMealData;
      this.addMealRequest(mealData, userId);
    });
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

  addMealRequest(mealData, userId = this.user._id) {
    this.http.post<any>(`${apiAddress}/api/users/${userId}/meals/`, mealData, { observe: 'response' }).pipe(
      retry(3),
      take(1)
    ).subscribe(response => {
      if (response.status === 201) {
        this.getRawObservable(userId).pipe(take(1)).subscribe(currentMealsArray => {
          const updatedArray = [...currentMealsArray];
          updatedArray.push(response.body);
          this.getBehaviourSubject(userId).next(updatedArray);
        });
      }
    });
  }

  getRawObservable(userId) {
    return this.getBehaviourSubject(userId).asObservable();
  }

  getBehaviourSubject(userId = this.user && this.user._id || 'null') {
    if (!this.observablesMap.has(userId)) {
      this.observablesMap.set(userId, new BehaviorSubject<any>([]));
    }
    return this.observablesMap.get(userId);
  }

  getFilteredMealObservable() {
    return this.currentFilteredAndGroupedMeals;
  }

  getFilterObservable() {
    return this.currentFilterSubject.asObservable();
  }

  deleteMealRequest(mealId, userId = this.user._id): void {
    this.http.delete(`${apiAddress}/api/users/${userId}/meals/${mealId}`).pipe(
      retry(3),
      take(1),
    ).subscribe((response: { n: number, nModified: number, ok: number }) => {
      if (response.nModified === 1) {
        this.getRawObservable(userId).pipe(take(1)).subscribe(currentMealsArray => {
          const updatedArray = currentMealsArray.filter(meal => meal._id !== mealId);
          this.getBehaviourSubject(userId).next(updatedArray);
        });
      }
    });
  }

  updateMealRequest(updatedMeal, userId = this.user._id): void {
    this.http.put(`${apiAddress}/api/users/${userId}/meals/${updatedMeal._id}`, updatedMeal).pipe(
      retry(3),
      take(1),
    ).subscribe((response: { n: number, nModified: number, ok: number }) => {
      if (response.nModified === 1) {
        this.getRawObservable(userId).pipe(take(1)).subscribe(currentMealsArray => {

          const updatedMealIndex = currentMealsArray.findIndex(arrayElement => arrayElement._id === updatedMeal._id);
          const updatedArray = [...currentMealsArray];
          updatedArray.splice(updatedMealIndex, 1, updatedMeal);

          this.getBehaviourSubject(userId).next(updatedArray);
        });
      }
    });
  }

  public getMeals(userId = this.user._id): void {
    this.http.get(`${apiAddress}/api/users/${userId}/meals`).pipe(
      retry(3),
      take(1),
      map((responseData: { _id: string, meals: Meal[] }) => responseData.meals)
    ).subscribe(meals => {
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
        const mealDay = `${mealDate.getUTCDate()}-${mealDate.getUTCMonth() + 1}-${mealDate.getUTCFullYear()}`;
        meal.day = mealDay;
        return mealDay;
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
