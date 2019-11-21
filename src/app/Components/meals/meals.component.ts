import { Component, OnInit } from '@angular/core';
import { MealsService } from '../../Services/meals.service';
import { MatDialog } from '@angular/material/dialog';
import { EditMealDialogComponent } from '../edit-meal-dialog/edit-meal-dialog.component';
import { Meal } from 'src/app/Models/meal';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent {

  private columsToDisplay: string[] = ['title', 'description', 'time', 'calories', 'actions'];
  private mealsObservable;
  private deleteMeal;

  constructor(private readonly mealsService: MealsService, private readonly editMealDialog: MatDialog) {
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
      console.log('The dialog was closed');
    });
  }
}



