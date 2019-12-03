import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Meal } from 'src/app/Models/meal';
import { User } from 'src/app/Models/user';
import { AdminService } from 'src/app/Services/admin.service';
import { MealsService } from 'src/app/Services/meals.service';
import { AddMealDialogComponent } from '../add-meal-dialog/add-meal-dialog.component';
import { EditMealDialogComponent } from '../edit-meal-dialog/edit-meal-dialog.component';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { UserService } from 'src/app/Services/user.service';

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
  private user: User;
  private data: any = {};
  private deleteMeal: any;

  constructor(private readonly adminService: AdminService,
              private readonly mealsService: MealsService,
              private readonly editMealDialog: MatDialog,
              private readonly userService: UserService,
  ) {

    this.deleteMeal = this.mealsService.deleteMeal.bind(this.mealsService);
    this.usersObservable = adminService.getUserObservable();
    this.adminService.getUsers();

  }

  ngOnInit() {
    this.usersSubscription = this.usersObservable.subscribe(users => {
      this.users = users;
    });
    this.userServiceSubscription = this.userService.currentUser.subscribe(user => {
      this.user = user;
    });

  }

  isAdmin() {
    return this.user && this.user.authLevel === 'ADMIN';
  }

  openEditDialog(meal: Meal, ownerId: string): void {
    const dialogRef = this.editMealDialog.open(EditMealDialogComponent, {
      width: '400px',
      height: '500px',
      data: { meal, ownerId },
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('TODO : Resolve');
    });
  }

  openMealAddDialog(userId) {
    const dialogRef = this.editMealDialog.open(AddMealDialogComponent, {
      width: '400px',
      height: '500px',
      data: userId,
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('TODO : Resolve');
    });
  }

  openEditUserDialog(user): void {
    const dialogRef = this.editMealDialog.open(EditUserDialogComponent, {
      width: '400px',
      height: '500px',
      data: user,
      panelClass: 'custom-dialog',
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
    this.userServiceSubscription.unsubscribe();
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
