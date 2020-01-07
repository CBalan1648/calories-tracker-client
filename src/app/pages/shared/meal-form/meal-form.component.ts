import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { getMealFormValues, resetMealForm } from 'src/app/helpers/functions.static';
import { mealFormConfig } from 'src/app/helpers/objects.static';
import { Meal } from 'src/app/models/meal';

@Component({
  selector: 'app-meal-form',
  templateUrl: './meal-form.component.html',
  styleUrls: ['./meal-form.component.scss']
})
export class MealFormComponent {
  @Input() hideBackground: boolean;
  @Input() meal: Meal;
  @Input() onSubmit: (meal: Meal) => void;

  constructor(private readonly formBuilder: FormBuilder,
  ) {
    console.log(this.hideBackground);
  }

  mealForm = this.formBuilder.group(mealFormConfig);

  submitForm() {
    if (this.mealForm.status === 'VALID') {
      this.onSubmit(getMealFormValues(this.mealForm));
      resetMealForm(this.mealForm);
    }
  }
}
