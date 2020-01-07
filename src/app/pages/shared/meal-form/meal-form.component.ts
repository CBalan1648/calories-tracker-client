import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { getMealFormValues, resetMealForm } from 'src/app/helpers/functions.static';
import { mealFormConfig } from 'src/app/helpers/objects.static';
import { MealsService } from 'src/app/services/meals.service';
import { Meal } from 'src/app/models/meal';

@Component({
  selector: 'app-meal-form',
  templateUrl: './meal-form.component.html',
  styleUrls: ['./meal-form.component.scss']
})
export class MealFormComponent {

  @Input() meal: Meal;
  @Input() onSubmit: (meal: Meal) => void;

  constructor(private readonly formBuilder: FormBuilder,
  ) { 
    console.log(this.onSubmit)
  }

 

  mealForm = this.formBuilder.group(mealFormConfig);

  submitForm() {
    if (this.mealForm.status === 'VALID') {
      this.onSubmit(getMealFormValues(this.mealForm));
      resetMealForm(this.mealForm);
    }
  }
}
