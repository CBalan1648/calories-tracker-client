import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Meal } from 'src/app/models/meal';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { MealsService } from '../../../../services/meals.service';
import { EditMealDialogComponent } from '../../../shared/edit-meal-dialog/edit-meal-dialog.component';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss']
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

    this.mealsObservable = this.mealsService.getFilteredMealObservable();
    this.mealsService.getMeals();
    this.deleteMeal = this.mealsService.deleteMealRequest.bind(this.mealsService);
  }

  openEditDialog(meal: Meal, ownerId = this.user._id): void {
    this.editMealDialog.open(EditMealDialogComponent, {
      width: '400px',
      height: '500px',
      panelClass: 'custom-dialog',
      data: { meal, ownerId },
    });
  }

  ngOnInit() {
    this.userServiceSubscription = this.userService.getUserObservable().subscribe(user => this.user = user);
    this.mealsObservableSubscription = this.mealsService.getFilteredMealObservable().subscribe(meals => this.meals = meals);
  }

  ngOnDestroy() {
    this.userServiceSubscription.unsubscribe();
    this.mealsObservableSubscription.unsubscribe();
  }
}
