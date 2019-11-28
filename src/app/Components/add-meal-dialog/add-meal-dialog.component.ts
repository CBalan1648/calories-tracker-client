import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { MealsService } from 'src/app/Services/meals.service';

@Component({
  selector: 'app-add-meal-dialog',
  templateUrl: './add-meal-dialog.component.html',
  styleUrls: ['./add-meal-dialog.component.css']
})
export class AddMealDialogComponent implements OnInit, OnDestroy {

  private observableSubject: Subject<any> = new Subject();
  private observableSubscription: Subscription;

  constructor(
    private readonly mealsService: MealsService,
    public dialogRef: MatDialogRef<AddMealDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public userId: string,
  ) { }

  mealForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: [''],
    time: [''],
    calories: ['', Validators.required]
  });

  ngOnInit() {
    this.observableSubscription = this.mealsService.connectRequestObservable(this.observableSubject);
  }

  ngOnDestroy() {
    this.mealsService.disconnectRequestObservable(this.observableSubscription);
  }

  submitForm() {
    if (this.mealForm.status === 'VALID') {
      const formValues = this.mealForm.controls;
      this.observableSubject.next([{
        title: formValues.title.value,
        description: formValues.description.value,
        time: formValues.time.value ? Date.parse(formValues.time.value) : Date.now(),
        calories: formValues.calories.value,
      }, this.userId]);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
