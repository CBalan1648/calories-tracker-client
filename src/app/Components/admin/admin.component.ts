import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Meal } from 'src/app/Models/meal';
import { User } from 'src/app/Models/user';
import { AdminService } from 'src/app/Services/admin.service';
import { MealsService } from 'src/app/Services/meals.service';
import { EditMealDialogComponent } from '../edit-meal-dialog/edit-meal-dialog.component';
import { AddMealDialogComponent } from '../add-meal-dialog/add-meal-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  private usersObservable: Observable<User[]>;
  private usersSubscription: Subscription;
  private users: User[] = null;
  private data: any = {};
  private deleteMeal: any;

  constructor(private readonly adminService: AdminService,
              private mealsService: MealsService,
              private readonly editMealDialog: MatDialog,
  ) {

    this.deleteMeal = this.mealsService.deleteMeal.bind(this.mealsService);
    this.usersObservable = adminService.getUserObservable();
    this.adminService.getUsers();

  }

  ngOnInit() {
    this.usersSubscription = this.usersObservable.subscribe(users => {
      this.users = users;
    });
  }

  openEditDialog(meal: Meal, ownerId: string): void {
    const dialogRef = this.editMealDialog.open(EditMealDialogComponent, {
      width: '400px',
      data: { meal, ownerId },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('TODO : Resolve');
    });
  }

  openMealAddDialog(userId) {
    const dialogRef = this.editMealDialog.open(AddMealDialogComponent, {
      width: '400px',
      data: userId,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('TODO : Resolve');
    });
  }

  deleteUser(userId) {
    this.adminService.deleteRequest(userId);
  }

  loadData(userId) {
    if (!this.data[userId]) {
      this.data[userId] = new RefactorDataSource(this.mealsService.getRawObservable(userId));
      this.mealsService.getMeals(userId);
    }
  }

  getData(userId) {
    return this.data[userId];
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }
}

export class RefactorDataSource extends DataSource<string> {

  private subscription = new Subscription();

  constructor(private mealsObservable) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.mealsObservable;
  }

  disconnect(): void { }
}
