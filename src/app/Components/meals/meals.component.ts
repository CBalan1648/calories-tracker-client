import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Meal } from 'src/app/Models/meal';
import { UserService } from 'src/app/Services/user.service';
import { MealsService } from '../../Services/meals.service';
import { EditMealDialogComponent } from '../edit-meal-dialog/edit-meal-dialog.component';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';


@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit, OnDestroy {

  @ViewChild(CdkVirtualScrollViewport)
  private viewport: CdkVirtualScrollViewport;

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

    this.mealsObservable = this.mealsService.getObservable();
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

  log(event, offset) {
    console.log('HELLO LAST ITEM', event, offset);
  }


  ngOnInit() {
    this.userServiceSubscription = this.userService.getUserObservable().subscribe(newValue => {
      this.caloriesValue = newValue.calories;
    });

    this.mealsObservableSubscription = this.mealsService.getObservable().subscribe(meals => this.meals = meals);
  }

  ngOnDestroy() {
    this.userServiceSubscription.unsubscribe();
    this.mealsObservableSubscription.unsubscribe();
  }
}
