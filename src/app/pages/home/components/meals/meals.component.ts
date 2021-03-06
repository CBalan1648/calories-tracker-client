import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Meal } from 'src/app/models/meal';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { MealsService } from '../../../../services/meals.service';
import { EditMealDialogComponent } from '../../../shared/edit-meal-dialog/edit-meal-dialog.component';
import { editMealDialogConfig } from 'src/app/helpers/objects.static';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss']
})
export class MealsComponent implements OnInit, OnDestroy {

  public columsToDisplay: string[] = ['title', 'description', 'time', 'calories', 'actions'];
  public mealsObservable;
  public deleteMeal;
  public user: User;
  public userServiceSubscription: Subscription;
  public mealsObservableSubscription: Subscription;
  public meals: Meal[];

  constructor(private readonly mealsService: MealsService,
              private readonly editMealDialog: MatDialog,
              private readonly userService: UserService) { }

  ngOnInit() {
    this.mealsService.getMeals();
    this.mealsObservableSubscription = this.mealsService.getFilteredMealObservable().subscribe(meals => this.meals = meals);
    this.deleteMeal = this.mealsService.deleteMealRequest.bind(this.mealsService);
    this.userServiceSubscription = this.userService.getUserObservable().subscribe(user => this.user = user);
  }

  openEditDialog(meal: Meal): void {
    this.editMealDialog.open(EditMealDialogComponent, editMealDialogConfig(meal, this.user._id));
  }

  ngOnDestroy() {
    this.userServiceSubscription.unsubscribe();
    this.mealsObservableSubscription.unsubscribe();
  }
}
