import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { MealsService } from 'src/app/services/meals.service';
import { Meal } from 'src/app/models/meal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private observableSubject: Subject<any> = new Subject();
  private observableSubscription: Subscription;

  constructor(private readonly mealService: MealsService) { }

  ngOnInit() {
    this.observableSubscription = this.mealService.connectRequestObservable(this.observableSubject);
  }

  ngOnDestroy() {
    this.mealService.disconnectRequestObservable(this.observableSubscription);
  }

  onSubmitNewMeal(meal: Meal) {
    this.observableSubject.next([meal]);
  }
}
