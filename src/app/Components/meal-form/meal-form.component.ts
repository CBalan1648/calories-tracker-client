import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MealsService } from 'src/app/Services/meals.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-meal-form',
  templateUrl: './meal-form.component.html',
  styleUrls: ['./meal-form.component.css']
})
export class MealFormComponent implements OnInit, OnDestroy {

  private observableSubject: Subject<any> = new Subject();
  private observableSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private readonly mealService: MealsService) { }

  mealForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: [''],
    time: [''],
    calories: ['', Validators.required]
  });


  ngOnInit() {
    this.observableSubscription = this.mealService.connectRequestObservable(this.observableSubject);
  }

  ngOnDestroy() {
    this.mealService.disconnectRequestObservable(this.observableSubscription);
  }

  submitForm() {
    if (this.mealForm.status === 'VALID') {
      const formValues = this.mealForm.controls;
      this.observableSubject.next([{
        title: formValues.title.value,
        description: formValues.description.value,
        time: formValues.time.value ? Date.parse(formValues.time.value) : Date.now(),
        calories: formValues.calories.value,
      }]);
    }
  }
}
