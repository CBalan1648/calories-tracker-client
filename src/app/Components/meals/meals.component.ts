import { Component, OnInit } from '@angular/core';
import { Meal } from 'src/app/Models/meal';
import { MealsService } from '../../Services/meals.service';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {

  private meals: any;
  private columsToDisplay: string[] = ['title', 'description', 'time', 'calories'];
  private mealsObservable ;


  constructor(private readonly mealsService : MealsService) {
    this.meals = [
      { id: 1, title: '1st Lunch', description: 'Something somethsomethingsomethingsomethingsomethingsomethingsomethingsomethinging somethsomethingsomething12312312312312312somethingsomethingsomethingsomethingsomethinging somethsomethingsomethingsomethingsomethingsomethingsomethingsomethinging lunch', time: 1574065337366, calories: 650 },
      { id: 2, title: '1st Dinner', description: 'Something something dinner', time: 1574065237366, calories: 786 },
      { id: 3, title: '2nd Lunch', description: 'Something something lunch', time: 1574065331366, calories: 540 },
      { id: 4, title: '2nd Dinner', description: 'Something something dinner', time: 1574065137366, calories: 237 },
      { id: 5, title: '3rd Lunch', description: 'Something something lunch', time: 1574065137366, calories: 879 },
      { id: 6, title: '3rd Dinner', description: 'Something something dinner', time: 1574063337366, calories: 865 },
      { id: 7, title: '4th Lunch', description: 'Something something lunch', time: 1574065334366, calories: 457 },
    ];
    this.mealsObservable = this.mealsService.getMeals()
  }

  ngOnInit() {
  
  }

}

