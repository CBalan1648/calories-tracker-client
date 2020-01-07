import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MealsService } from 'src/app/services/meals.service';
import { Meal } from '../../models/meal';
import { editMealFormConfig } from 'src/app/helpers/objects.static';
import { getEditMealFormValues } from 'src/app/helpers/functions.static';

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

  mealForm = this.formBuilder.group(editMealFormConfig(this.data));

  submitForm() {
    if (this.mealForm.status === 'VALID') {
      this.mealsService.updateMealRequest(getEditMealFormValues(this.mealForm, this.data), this.data.ownerId);
      this.onClose();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
