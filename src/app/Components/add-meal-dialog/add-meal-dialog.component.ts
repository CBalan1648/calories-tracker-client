import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { getMealFormValues } from 'src/app/Helpers/functions.static';
import { mealFormConfig } from 'src/app/Helpers/objects.static';
import { MealsService } from 'src/app/Services/meals.service';

@Component({
  selector: 'app-add-meal-dialog',
  templateUrl: './add-meal-dialog.component.html',
  styleUrls: ['./add-meal-dialog.component.scss']
})
export class AddMealDialogComponent implements OnInit, OnDestroy {

  private observableSubject: Subject<any> = new Subject();
  private observableSubscription: Subscription;

  constructor(
    private readonly mealsService: MealsService,
    private readonly dialogRef: MatDialogRef<AddMealDialogComponent>,
    private readonly formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public userId: string,
  ) { }

  mealForm = this.formBuilder.group(mealFormConfig);

  ngOnInit() {
    this.observableSubscription = this.mealsService.connectRequestObservable(this.observableSubject);
  }

  ngOnDestroy() {
    this.mealsService.disconnectRequestObservable(this.observableSubscription);
  }

  submitForm() {
    if (this.mealForm.status === 'VALID') {
      this.observableSubject.next([getMealFormValues(this.mealForm), this.userId]);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
