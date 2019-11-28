import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Meal } from 'src/app/Models/meal';
import { User } from 'src/app/Models/user';
import { UserService } from 'src/app/Services/user.service';
import { MealsService } from '../../Services/meals.service';
import { EditMealDialogComponent } from '../edit-meal-dialog/edit-meal-dialog.component';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit, OnDestroy {


  private columsToDisplay: string[] = ['title', 'description', 'time', 'calories', 'actions'];
  private mealsObservable;
  private deleteMeal;
  private user: User;
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

  openEditDialog(meal: Meal, ownerId = this.user._id): void {
    const dialogRef = this.editMealDialog.open(EditMealDialogComponent, {
      width: '400px',
      data: { meal, ownerId },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('TODO : Resolve');
    });
  }

  ngOnInit() {
    this.userServiceSubscription = this.userService.getUserObservable().subscribe(user => {
      this.user = user;
    });

    this.mealsObservableSubscription = this.mealsService.getFilteredObservable().subscribe(meals => this.meals = meals);
  }

  ngOnDestroy() {
    this.userServiceSubscription.unsubscribe();
    this.mealsObservableSubscription.unsubscribe();
  }
}
