import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getMealFormValues, resetMealForm, getEditMealFormValues } from 'src/app/helpers/functions.static';
import { mealFormConfig, editMealFormConfig } from 'src/app/helpers/objects.static';
import { Meal } from 'src/app/models/meal';

@Component({
  selector: 'app-meal-form',
  templateUrl: './meal-form.component.html',
  styleUrls: ['./meal-form.component.scss']
})
export class MealFormComponent implements OnInit {
  @Input() hideBackground: boolean;
  @Input() meal: Meal;
  @Input() onSubmit: (meal: Meal) => void;

  public mealForm: FormGroup;

  constructor(readonly formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.mealForm = this.formBuilder.group(this.meal ? editMealFormConfig(this.meal) : mealFormConfig);
  }

  submitForm() {
    if (this.mealForm.status === 'VALID') {
      this.onSubmit(this.meal ? getEditMealFormValues(this.mealForm, this.meal) : getMealFormValues(this.mealForm));
      resetMealForm(this.mealForm);
    }
  }
}
