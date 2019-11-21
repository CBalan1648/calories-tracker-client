import { Component, OnInit } from '@angular/core';
import { MealsService } from '../../Services/meals.service';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {

  private columsToDisplay: string[] = ['title', 'description', 'time', 'calories', 'actions'];
  private mealsObservable;
  private deleteMeal;

  constructor(private readonly mealsService: MealsService) {
    this.mealsObservable = this.mealsService.getObservable()
    this.mealsService.getMeals()
    this.deleteMeal = this.mealsService.deleteMeal.bind(this.mealsService)
  }
  ngOnInit() {

  }

}

