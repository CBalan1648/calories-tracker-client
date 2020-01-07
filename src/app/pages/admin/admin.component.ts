import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Meal } from 'src/app/models/meal';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import { MealsService } from 'src/app/services/meals.service';
import { AddMealDialogComponent } from './components/add-meal-dialog/add-meal-dialog.component';
import { EditMealDialogComponent } from '../shared/edit-meal-dialog/edit-meal-dialog.component';
import { EditUserDialogComponent } from './components/edit-user-dialog/edit-user-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { isAdmin } from 'src/app/helpers/functions.static';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  private usersObservable: Observable<User[]>;
  private usersSubscription: Subscription;
  private userServiceSubscription: Subscription;
  private users: User[] = null;
  private activeUser: User;
  private data: any = {};
  private deleteMeal: any;
  private isAdmin = isAdmin.bind(null);
  private deleteUser: (userId: string) => void;


  constructor(private readonly adminService: AdminService,
              private readonly mealsService: MealsService,
              private readonly editMealDialog: MatDialog,
              private readonly userService: UserService,
  ) {

    this.deleteMeal = this.mealsService.deleteMealRequest.bind(this.mealsService);
    this.deleteUser = this.adminService.deleteUserRequest.bind(this.adminService);
    this.usersObservable = adminService.getUserObservable();
    this.adminService.getUsers();
  }

  ngOnInit() {
    this.usersSubscription = this.usersObservable.subscribe(users => this.users = users);
    this.userServiceSubscription = this.userService.getUserObservable().subscribe(user => this.activeUser = user);
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
    this.userServiceSubscription.unsubscribe();
  }

  openEditDialog(meal: Meal, ownerId: string): void {
    this.editMealDialog.open(EditMealDialogComponent, {
      width: '400px',
      height: '500px',
      data: { meal, ownerId },
      panelClass: 'custom-dialog',
    });
  }

  openMealAddDialog(userId) {
    this.editMealDialog.open(AddMealDialogComponent, {
      width: '400px',
      height: '500px',
      data: userId,
      panelClass: 'custom-dialog',
    });

  }

  openEditUserDialog(user): void {
    this.editMealDialog.open(EditUserDialogComponent, {
      width: '400px',
      height: '500px',
      data: user,
      panelClass: 'custom-dialog',
    });
  }

}


export class RefactorDataSource extends DataSource<string> {

  constructor(private mealsObservable) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.mealsObservable;
  }

  disconnect(): void { }
}
