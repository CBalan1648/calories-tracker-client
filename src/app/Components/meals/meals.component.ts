import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Meal } from 'src/app/Models/meal';
import { UserService } from 'src/app/Services/user.service';
import { MealsService } from '../../Services/meals.service';
import { EditMealDialogComponent } from '../edit-meal-dialog/edit-meal-dialog.component';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter, tap } from 'rxjs/operators';
 

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit, OnDestroy {


  private columsToDisplay: string[] = ['title', 'description', 'time', 'calories', 'actions'];
  private mealsObservable;
  private deleteMeal;
  private caloriesValue: number;
  private userServiceSubscription: Subscription;
  private mealsObservableSubscription: Subscription;
  private meals: Meal[];

  constructor(private readonly mealsService: MealsService,
              private readonly editMealDialog: MatDialog,
              private readonly userService: UserService) {

    this.mealsObservable = this.mealsService.getFilteredObservable();
    this.mealsService.getMeals();
    this.deleteMeal = this.mealsService.deleteMeal.bind(this.mealsService);
  }

  openEditDialog(meal: Meal): void {
    const dialogRef = this.editMealDialog.open(EditMealDialogComponent, {
      width: '400px',
      data: meal,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('TODO : Resolve');
    });
  }

  log(event, offset) : Meal[] {
    console.log('HELLO LAST  ITEM', event, offset);

    return [
      {title : "meal ", _id : "asd", description : "not a description", calories : 412, time : 1124122412, overCal : false},
      {title : "meal ", _id : "asd", description : "not a description", calories : 412, time : 1124122412, overCal : false}
    ]
  }


  ngOnInit() {
    this.userServiceSubscription = this.userService.getUserObservable().subscribe(newValue => {
      this.caloriesValue = newValue.calories;
    });

    this.mealsObservableSubscription = this.mealsService.getFilteredObservable().pipe(tap(console.log)).subscribe(meals => this.meals = meals);
  }

  ngOnDestroy() {
    this.userServiceSubscription.unsubscribe();
    this.mealsObservableSubscription.unsubscribe();
  }
}
