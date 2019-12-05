import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/Services/user.service';
import { MealsService } from 'src/app/Services/meals.service';
import { Subscription } from 'rxjs';
import { Meal } from 'src/app/Models/meal';
import { DataSource } from '@angular/cdk/table';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private daysMap: Map<string, number>;
  private observableSubscriptions: Subscription;
  private caloriesByDay: number[];
  private userCalories = 0;
  private userObservableSubscription: Subscription;

  private width = 600;
  private height = 300;
  private redGradientPart: string;
  private greenGradientPart: string;
  private svgPath = 'M 0 240  116 110 233 84  350 213 466 276  583 277 700 233';
  private svgPathCalories = 'M 0 240  116 110 233 84  350 213 466 276  583 277 700 233';

  private sliderMinValue = 0 + 30;
  private sliderMaxValue = 200;
  private sliderValue = 150;

  constructor(private readonly userService: UserService, private readonly mealService: MealsService) { }

  updateCalories(event) {
    this.userService.updateCalories(event);
  }

  ngOnInit() {
    this.observableSubscriptions = this.mealService.getFilteredObservable().pipe(filter(meals => !!meals.length)).subscribe(meals => {
      const daysMap = new Map();

      meals.forEach(meal => {
        const currentValue = daysMap.get(meal.day);
        daysMap.set(meal.day, currentValue ? currentValue + meal.calories : meal.calories);
      });

      this.daysMap = daysMap;
      this.caloriesByDay = getLastXDaysCalories(7, daysMap);
      this.calculateSvgPath();
      this.calculateSvgPathCalories();
    });

    this.userObservableSubscription = this.userService.getUserObservable().subscribe(user => {
      this.userCalories = user.targetCalories;
      console.log(this.userCalories);
    });
  }

  sliderChange(event) {
    console.log(event);
    this.userCalories = event.value;
    this.calculateSvgPathCalories();
  }

  calculateSvgPathCalories() {
    const maxCalories = Math.max(...this.caloriesByDay);
    const normalizedCaloriesHeight = Math.floor(this.height / (maxCalories + maxCalories / 3) * this.userCalories);
    const reversedCaloriesHeight = this.height - normalizedCaloriesHeight;

    this.sliderMaxValue = maxCalories + maxCalories / 3;
    this.sliderValue = this.userCalories;

    const redGradientPart = Math.floor(reversedCaloriesHeight * 100 / this.height);
    
    this.redGradientPart = `${redGradientPart}%`;
    this.greenGradientPart = `${redGradientPart}%`;



    console.log(this.height, redGradientPart);

    this.svgPathCalories = `M 0 ${reversedCaloriesHeight}, ${this.width}, ${reversedCaloriesHeight}`;
  }

  ngOnDestroy() {
    this.observableSubscriptions.unsubscribe();
    this.userObservableSubscription.unsubscribe();
  }

  calculateSvgPath() {
    const normalizedData = reverseDataHeight(normalizeDataHeight(this.caloriesByDay, this.height), this.height);
    const normalizedPositions = (addNormalizedDataWidth(normalizedData, this.width));
    this.svgPath = createSvgPath(normalizedPositions);
  }
}

const getLastXDaysCalories = (days, daysMap: Map<string, number>) => {

  const date = new Date();
  const caloriesByDay = [];

  for (let x = 0; x <= days; x++) {
    date.setDate(date.getDate() - 1);
    caloriesByDay.push(daysMap.get(`${date.getUTCDate()}-${date.getUTCMonth() + 1}-${date.getUTCFullYear()}`) || 0);
  }
  return caloriesByDay.reverse();
};

const normalizeDataHeight = (array, height) => {
  const maxValue = Math.max(...array);
  const ajustedMax = maxValue + maxValue / 3;

  return array.map((value) => {
    return Math.floor(height / ajustedMax * value);
  });
};

const reverseDataHeight = (array, height) => {
  return array.map(value => height - value);
};

const addNormalizedDataWidth = (array, width) => {
  return array.map((value, index) => {
    return [Math.floor((width / (array.length - 1) * index)), value];
  });
};

const line = (pointA, pointB) => {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  };
};

const controlPoint = (current, previous, next, reverse) => {
  const previousPoint = previous || current;
  const nextPoint = next || current;
  const smoothing = 0.2;
  const opposedLine = line(previousPoint, nextPoint);
  const angle = opposedLine.angle + (reverse ? Math.PI : 0);
  const length = opposedLine.length * smoothing;

  const x = current[0] + Math.cos(angle) * length;
  const y = current[1] + Math.sin(angle) * length;
  return [x, y];
};

const bezierCommand = (point, i, a) => {
  const [startControlPointX, startControlPointY] = controlPoint(a[i - 1], a[i - 2], point, false);
  const [endControlPointX, endControlPointY] = controlPoint(point, a[i - 1], a[i + 1], true);

  return `C ${startControlPointX},${startControlPointY} ` +
    `${endControlPointX},${endControlPointY} ` +
    `${point[0]},${point[1]} `;
};

const createSvgPath = (array) => {
  let svgPath = `M ${array[0][0]}, ${array[0][1]} `;
  array.forEach((value, index, currentArray) => {
    if (index === 0) { return; }
    svgPath += bezierCommand(value, index, currentArray);
  });
  return svgPath;
};

