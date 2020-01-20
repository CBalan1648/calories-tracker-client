import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MealsService } from 'src/app/services/meals.service';
import { UserService } from 'src/app/services/user.service';
import { getLastXDaysCalories } from './dashboard.static';
import { Meal } from 'src/app/models/meal';

const DEFAULT_TIME_SPAN = 7;

const defaultDashboardGraphData = [
  [0, 144, '5-10-2019'],
  [1, 144, '5-10-2019'],
  [2, 144, '5-10-2019'],
  [3, 144, '5-10-2019']
];

const defaultCaloriesSliderMaxValue = 100;

const defaultCaloriesSliderMinValue = 10;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  private daysMap: Map<string, number>;
  private mealsObservableSubscription: Subscription;
  private caloriesByDay: number[][];
  private userCalories = 0;
  private userObservableSubscription: Subscription;

  private caloriesChangeSubject = new Subject();
  private daysChangeSubject = new Subject();

  private graphDataSubject = new BehaviorSubject(defaultDashboardGraphData);
  private targetCaloriesValueSubject = new Subject();

  private caloriesChangeSubscription: Subscription;
  private daysChangeSubscription: Subscription;

  private displayedTimeSpan = DEFAULT_TIME_SPAN;

  private sliderMinValue = defaultCaloriesSliderMaxValue;
  private sliderMaxValue = defaultCaloriesSliderMaxValue;

  private sliderValue = defaultCaloriesSliderMinValue;

  private normalizedPositions: Array<Array<number>>;

  constructor(private readonly userService: UserService, private readonly mealService: MealsService) { }

  ngOnInit() {
    this.mealsObservableSubscription = this.mealService.getFilteredMealObservable().pipe(
      filter(meals => !!meals.length)
    ).subscribe(meals => {
      this.daysMap = mapMealsToDays(meals);
      this.caloriesByDay = getLastXDaysCalories(DEFAULT_TIME_SPAN, this.daysMap);
      this.graphDataSubject.next(this.caloriesByDay);
    });

    this.userObservableSubscription = this.userService.getUserObservable().subscribe(user => {
      this.userCalories = user.targetCalories;
    });

    this.caloriesChangeSubscription = this.caloriesChangeSubject.subscribe(this.sliderChange.bind(this));
    this.daysChangeSubscription = this.daysChangeSubject.subscribe(this.sliderDaysChange.bind(this));
  }

  setSliderValue(value: number) {
    this.sliderValue = value;
  }

  setSliderMaxValue(maxValue: number) {
    this.sliderMaxValue = maxValue;
  }

  ngOnDestroy() {
    this.mealsObservableSubscription.unsubscribe();
    this.userObservableSubscription.unsubscribe();
    this.caloriesChangeSubscription.unsubscribe();
    this.daysChangeSubscription.unsubscribe();
  }

  sliderChange(event) {
    this.userCalories = event.value;
    this.targetCaloriesValueSubject.next(this.userCalories);
  }

  sliderDaysChange(event) {
    this.caloriesByDay = getLastXDaysCalories(event.value, this.daysMap);
    this.graphDataSubject.next(this.caloriesByDay);
    this.displayedTimeSpan = event.value;
  }

  updateCalories(event) {
    this.userService.updateCalories(event);
  }
}

const mapMealsToDays = (meals: Meal[]): Map<string, number> => {
  const daysMap = new Map();

  meals.forEach(meal => {
    const currentValue = daysMap.get(meal.day);
    daysMap.set(meal.day, currentValue ? currentValue + meal.calories : meal.calories);
  });

  return daysMap;
};
