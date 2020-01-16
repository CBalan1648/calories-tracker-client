import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, ObservableInput, Subscription } from 'rxjs';
import { catchError, filter, map, mergeMap, retryWhen, take } from 'rxjs/operators';
import { apiAddress } from '../config';
import { isInTimeFrame, isInTimeSpan, updateMealWithCalories, getTimeSpan, getTimeFrame } from '../helpers/functions.static';
import { requestRetryStrategy } from '../helpers/request-retry.strategy';
import { Meal } from '../models/meal';
import { User } from '../models/user';
import { ResponseHandlerService } from './response-handler.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  private user: User;
  private observablesMap: Map<string, BehaviorSubject<any>> = new Map();

  public currentFilterSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentFilteredMeals: Observable<any[]>;
  public currentFilteredAndGroupedMeals: Observable<any[]>;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private responseHandlerService: ResponseHandlerService
  ) {

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

  public connectRequestObservable(observable: Observable<any>): Subscription {
    return observable.subscribe(newMealData => {
      const [mealData, userId] = newMealData;
      this.addMealRequest(mealData, userId);
    });
  }

  public disconnectRequestObservable(subscription: Subscription): void {
    subscription.unsubscribe();
  }

  public connectFilterObservable(observable: Observable<any>): Subscription {
    return observable.subscribe((filterValue) => { this.currentFilterSubject.next(filterValue); });
  }

  private informUserOfError(error, caught): ObservableInput<any> {
    this.responseHandlerService.handleResponseCode('meal', error.status);
    throw error;
  }

  public disconnectFilterObservable(subscription: Subscription): void {
    this.currentFilterSubject.next(null);
    subscription.unsubscribe();
  }

  private handleAddMealResponse(userId, response) {
    if (response.status !== 201) { return void 0; }

    this.getRawObservable(userId).pipe(take(1)).subscribe(currentMealsArray => {
      const updatedArray = [...currentMealsArray];
      updatedArray.push(response.body);
      this.getBehaviourSubject(userId).next(updatedArray);
    });
  }

  public addMealRequest(mealData, userId = this.user._id) {
    this.http.post<any>(`${apiAddress}/api/users/${userId}/meals/`, mealData, { observe: 'response' }).pipe(
      retryWhen(requestRetryStrategy()),
      catchError(this.informUserOfError.bind(this)),
      take(1)
    ).subscribe(this.handleAddMealResponse.bind(this, userId));
  }

  public getRawObservable(userId) {
    return this.getBehaviourSubject(userId).asObservable();
  }

  public getBehaviourSubject(userId = this.user && this.user._id || 'null') {
    if (!this.observablesMap.has(userId)) {
      this.observablesMap.set(userId, new BehaviorSubject<any>([]));
    }
    return this.observablesMap.get(userId);
  }

  public getFilteredMealObservable() {
    return this.currentFilteredAndGroupedMeals;
  }

  public getFilterObservable() {
    return this.currentFilterSubject.asObservable();
  }

  private handleDeleteMealResponse(userId, mealId, response) {
    if (response.nModified === 1) {
      this.getRawObservable(userId).pipe(take(1)).subscribe(currentMealsArray => {
        const updatedArray = currentMealsArray.filter(meal => meal._id !== mealId);
        this.getBehaviourSubject(userId).next(updatedArray);
      });
    }
  }

  public deleteMealRequest(mealId, userId = this.user._id): void {
    this.http.delete(`${apiAddress}/api/users/${userId}/meals/${mealId}`).pipe(
      retryWhen(requestRetryStrategy()),
      catchError(this.informUserOfError.bind(this)),
      take(1),
    ).subscribe(this.handleDeleteMealResponse.bind(this, userId, mealId));
  }

  private handleUpdateMealResponse(userId, updatedMeal, response) {
    if (response.nModified === 1) {
      this.getRawObservable(userId).pipe(take(1)).subscribe(currentMealsArray => {

        const updatedMealIndex = currentMealsArray.findIndex(arrayElement => arrayElement._id === updatedMeal._id);
        const updatedArray = [...currentMealsArray];
        updatedArray.splice(updatedMealIndex, 1, updatedMeal);

        this.getBehaviourSubject(userId).next(updatedArray);
      });
    }
  }

  public updateMealRequest(updatedMeal, userId = this.user._id): void {
    this.http.put(`${apiAddress}/api/users/${userId}/meals/${updatedMeal._id}`, updatedMeal).pipe(
      retryWhen(requestRetryStrategy()),
      catchError(this.informUserOfError.bind(this)),
      take(1),
    ).subscribe(this.handleUpdateMealResponse.bind(this, userId, updatedMeal));
  }

  private handleGetMealRequest(userId, meals) {
    this.getBehaviourSubject(userId).next(meals);
  }

  public getMeals(userId = this.user._id): void {
    this.http.get(`${apiAddress}/api/users/${userId}/meals`).pipe(
      retryWhen(requestRetryStrategy()),
      catchError(this.informUserOfError.bind(this)),
      take(1),
      map((responseData: { _id: string, meals: Meal[] }) => responseData.meals)
    ).subscribe(this.handleGetMealRequest.bind(this, userId));
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

const containString = (testTitleString, testDescriptionString, filterString) => {
  return testTitleString.toLowerCase().includes(filterString.toLowerCase()) ||
    testDescriptionString.toLowerCase().includes(filterString.toLowerCase());
};

