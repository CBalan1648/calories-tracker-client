import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MealsService } from 'src/app/Services/meals.service';
import { Meal } from '../../Models/meal';

@Component({
  selector: 'app-edit-meal-dialog',
  templateUrl: './edit-meal-dialog.component.html',
  styleUrls: ['./edit-meal-dialog.component.scss']
})
export class EditMealDialogComponent {

  constructor(
    private readonly mealsService: MealsService,
    public dialogRef: MatDialogRef<EditMealDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { meal: Meal, ownerId: string },
  ) { }

  mealForm = this.formBuilder.group({
    title: [this.data.meal.title, Validators.required],
    description: [this.data.meal.description],
    time: [new Date(this.data.meal.time).toISOString().slice(0, -1)],
    calories: [this.data.meal.calories, Validators.required]
  });

  submitForm() {
    if (this.mealForm.status === 'VALID') {
      const formValues = this.mealForm.controls;
      this.mealsService.updateMeal({
        _id: this.data.meal._id,
        title: formValues.title.value,
        description: formValues.description.value,
        calories: formValues.calories.value,
        time: Date.parse(formValues.time.value) || this.data.meal.time,
      }, this.data.ownerId);

      this.onClose()
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
