import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { isAdmin } from 'src/app/helpers/functions.static';
import { addMealDialogConfig, editMealDialogConfig, editUserDialogConfig } from 'src/app/helpers/objects.static';
import { Meal } from 'src/app/models/meal';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import { MealsService } from 'src/app/services/meals.service';
import { UserService } from 'src/app/services/user.service';
import { EditMealDialogComponent } from '../shared/edit-meal-dialog/edit-meal-dialog.component';
import { AddMealDialogComponent } from './components/add-meal-dialog/add-meal-dialog.component';
import { EditUserDialogComponent } from './components/edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  public usersSubscription: Subscription;
  public userServiceSubscription: Subscription;
  public users: User[] = null;
  public activeUser: User;
  public data: any = {};
  public deleteMeal: any;
  public isAdmin = isAdmin.bind(null);
  public deleteUser: (userId: string) => void;

  constructor(private readonly adminService: AdminService,
              private readonly mealsService: MealsService,
              private readonly dialog: MatDialog,
              private readonly userService: UserService,
  ) { }

  ngOnInit() {
    this.adminService.getUsers();
    this.usersSubscription = this.adminService.getUserObservable().subscribe(users => this.users = users);
    this.userServiceSubscription = this.userService.getUserObservable().subscribe(user => this.activeUser = user);
    this.deleteMeal = this.mealsService.deleteMealRequest.bind(this.mealsService);
    this.deleteUser = this.adminService.deleteUserRequest.bind(this.adminService);
  }

  loadData(userId: string) {
    if (!this.data[userId]) {
      this.data[userId] = new RefactorDataSource(this.mealsService.getRawObservable(userId));
      this.mealsService.getMeals(userId);
    }
  }

  getData(userId: string): RefactorDataSource {
    console.log("HELLO", this.data)
    return this.data[userId];
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
    this.userServiceSubscription.unsubscribe();
  }

  openEditDialog(meal: Meal, ownerId: string): void {
    this.dialog.open(EditMealDialogComponent, editMealDialogConfig(meal, ownerId));
  }

  openMealAddDialog(userId: string): void {
    this.dialog.open(AddMealDialogComponent, addMealDialogConfig(userId));

  }

  openEditUserDialog(user: User): void {
    this.dialog.open(EditUserDialogComponent, editUserDialogConfig(user));
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
