import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { mealFormConfig } from 'src/app/helpers/objects.static';
import { Meal } from 'src/app/models/meal';
import { MealsService } from 'src/app/services/meals.service';


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

  onSubmitNewMeal(newMeal: Meal) {
    this.observableSubject.next([newMeal, this.userId]);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
