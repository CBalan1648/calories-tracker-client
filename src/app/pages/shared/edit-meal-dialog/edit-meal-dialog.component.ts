import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MealsService } from 'src/app/services/meals.service';
import { Meal } from '../../../models/meal';

@Component({
  selector: 'app-edit-meal-dialog',
  template: `<app-meal-form [meal]="data.meal" [onSubmit]="onSubmitEditedMeal.bind(this)"></app-meal-form>`,
})
export class EditMealDialogComponent {

  constructor(
    private readonly mealsService: MealsService,
    public dialogRef: MatDialogRef<EditMealDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { meal: Meal, ownerId: string },
  ) { }

  onSubmitEditedMeal(meal: Meal) {
    this.mealsService.updateMealRequest(meal, this.data.ownerId);
    this.onClose();
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
