import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { filter, throttle, debounceTime } from 'rxjs/operators';
import { MealsService } from 'src/app/Services/meals.service';
import { UserService } from 'src/app/Services/user.service';
import { getLastXDaysCalories, reverseDataHeight, addNormalizedDataWidth, normalizeDataHeight, createSvgPath } from './dashboard.static';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('svgElementIdentifier', { static: false })
  private svgElementIdentifier: ElementRef;

  private daysMap: Map<string, number>;
  private mealsObservableSubscription: Subscription;
  private caloriesByDay: number[];
  private userCalories = 0;
  private userObservableSubscription: Subscription;

  private caloriesChangeSubject = new Subject();
  private daysChangeSubject = new Subject();

  private caloriesChangeSubscription: Subscription;
  private daysChangeSubscription: Subscription;

  private width = 600;
  private height = 300;
  private redGradientPart: string;
  /**
   * daca documentez aici o sa vad usor oriunde vreau sa folosesc fara sa dau scroll sau sa deschid fisierul
   */
  private greenGradientPart: string;
  private svgPath = 'M 0 0';
  private svgPathCalories = 'M 0 0';

  private displayedTimeSpan = 7;

  private sliderMinValue = 0 + 10;
  private sliderMaxValue = 1;
  
  private sliderValue = 1;

  private normalizedPositions: Array<Array<number>>;

  constructor(private readonly userService: UserService, private readonly mealService: MealsService) { }

  ngOnInit() {
    this.mealsObservableSubscription = this.mealService.getFilteredMealObservable().pipe(
      filter(meals => !!meals.length)
    ).subscribe(meals => {
      const daysMap = new Map();

      meals.forEach(meal => {
        const currentValue = daysMap.get(meal.day);
        daysMap.set(meal.day, currentValue ? currentValue + meal.calories : meal.calories);
      });

      this.daysMap = daysMap;
      this.caloriesByDay = getLastXDaysCalories(7, daysMap);
      this.calculateSvgGraph();
    });

    this.userObservableSubscription = this.userService.getUserObservable().subscribe(user => {
      this.userCalories = user.targetCalories;
    });

    this.caloriesChangeSubscription = this.caloriesChangeSubject.subscribe(this.sliderChange.bind(this));
    this.daysChangeSubscription = this.daysChangeSubject.subscribe(this.sliderDaysChange.bind(this));
  }

  @HostListener('window:resize')
  onResize() {
    this.width = this.svgElementIdentifier.nativeElement.clientWidth;
    this.calculateSvgGraph();
  }

  calculateSvgGraph() {
    this.calculateSvgPath();
    this.calculateSvgPathCalories();
  }

  ngAfterViewInit() {
    this.width = this.svgElementIdentifier.nativeElement.clientWidth - 70;
  }

  ngOnDestroy() {
    this.mealsObservableSubscription.unsubscribe();
    this.userObservableSubscription.unsubscribe();
    this.caloriesChangeSubscription.unsubscribe();
    this.daysChangeSubscription.unsubscribe();
  }

  sliderChange(event) {
    this.userCalories = event.value;
    this.calculateSvgPathCalories();
  }

  sliderDaysChange(event) {
    this.caloriesByDay = getLastXDaysCalories(event.value, this.daysMap);
    this.calculateSvgPath();
    this.displayedTimeSpan = event.value;
  }

  calculateSvgPathCalories() {
    const maxCalories = Math.max(...this.caloriesByDay.map(caloriesData => caloriesData[0]));
    const normalizedCaloriesHeight = Math.floor(this.height / (maxCalories + maxCalories / 3) * this.userCalories);
    const reversedCaloriesHeight = this.height - normalizedCaloriesHeight;

    this.sliderMaxValue = Math.floor(maxCalories + maxCalories / 3);
    this.sliderValue = this.userCalories;

    const redGradientPart = Math.floor(reversedCaloriesHeight * 100 / this.height);

    this.redGradientPart = `${redGradientPart - 20}%`;
    this.greenGradientPart = `${redGradientPart + 20}%`;

    this.svgPathCalories = `M 0 ${reversedCaloriesHeight}, ${this.width}, ${reversedCaloriesHeight}`;
  }

  updateCalories(event) {
    this.userService.updateCalories(event);
  }



  calculateSvgPath() {
    const normalizedData = reverseDataHeight(normalizeDataHeight(this.caloriesByDay, this.height), this.height);
    const normalizedPositions = (addNormalizedDataWidth(normalizedData, this.width));
    this.normalizedPositions = normalizedPositions;
    this.svgPath = createSvgPath(normalizedPositions);
  }
}



