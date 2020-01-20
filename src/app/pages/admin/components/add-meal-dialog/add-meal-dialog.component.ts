import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { Meal } from 'src/app/models/meal';
import { MealsService } from 'src/app/services/meals.service';

@Component({
  selector: 'app-add-meal-dialog',
  template: `<app-meal-form [onSubmit]="onSubmitNewMeal.bind(this)"></app-meal-form>`
})
export class AddMealDialogComponent implements OnInit, OnDestroy {

  public observableSubject: Subject<any> = new Subject();
  public observableSubscription: Subscription;

  constructor(
    private readonly mealsService: MealsService,
    private readonly dialogRef: MatDialogRef<AddMealDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public userId: string,
  ) { }

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
