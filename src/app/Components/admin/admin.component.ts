import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/Models/user';
import { AdminService } from 'src/app/Services/admin.service';
import { MealsService } from 'src/app/Services/meals.service';
import { EditMealDialogComponent } from '../edit-meal-dialog/edit-meal-dialog.component';
import { Meal } from 'src/app/Models/meal';

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
    adminService.getUsers();
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

  onClick(event) {
    event.preventDefault();
    console.log(event);
  }

  loadData(userId) {
    console.log('called SET setData with ', userId);

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
    console.log('CONNECT');
    return this.mealsObservable;
  }

  disconnect(): void {
    console.log('DISCONNECTED');
  }
}
