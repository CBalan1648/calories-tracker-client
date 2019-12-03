import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { getMealFormValues, resetMealForm } from 'src/app/Helpers/functions.static';
import { mealFormConfig } from 'src/app/Helpers/objects.static';
import { MealsService } from 'src/app/Services/meals.service';

@Component({
  selector: 'app-meal-form',
  templateUrl: './meal-form.component.html',
  styleUrls: ['./meal-form.component.scss']
})
export class MealFormComponent implements OnInit, OnDestroy {

  private observableSubject: Subject<any> = new Subject();
  private observableSubscription: Subscription;

  constructor(private readonly formBuilder: FormBuilder,
              private readonly mealService: MealsService) { }

  mealForm = this.formBuilder.group(mealFormConfig);

  ngOnInit() {
    this.observableSubscription = this.mealService.connectRequestObservable(this.observableSubject);
  }

  ngOnDestroy() {
    this.mealService.disconnectRequestObservable(this.observableSubscription);
  }

  submitForm() {
    if (this.mealForm.status === 'VALID') {
      this.observableSubject.next([getMealFormValues(this.mealForm)]);
      resetMealForm(this.mealForm);
    }
  }
}
