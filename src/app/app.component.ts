import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddUserDialogComponent } from './pages/admin/components/add-user-dialog/add-user-dialog.component';
import { SearchUserDialogComponent } from './pages/admin/components/search-user-dialog/search-user-dialog.component';
import { User } from './models/user';
import { AdminService } from './services/admin.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private userSearchRef: MatSnackBarRef<SearchUserDialogComponent>;

  constructor(private readonly router: Router,
              private readonly userService: UserService,
              private readonly adminService: AdminService,
              private readonly popupDialog: MatDialog,
              private readonly snackBar: MatSnackBar) { }

  private userServiceSubscriptions: Subscription;
  private showSideBar: boolean;
  private user: User;
  private activeButton = 'HOME';
  private filterValueSubscription: Subscription;
  private filterValue: string;

  ngOnInit() {
    this.userServiceSubscriptions = this.userService.getUserObservable().subscribe(user => {
      this.user = user;
      this.showSideBar = !!user.email;
    });

    this.filterValueSubscription = this.adminService.getFilterObservable().subscribe(value => {
      this.filterValue = value;
    });
  }

  isSuperUser(authLevel) {
    return authLevel === 'USER_MANAGER' || authLevel === 'ADMIN';
  }

  isAdmin(authLevel) {
    return authLevel === 'ADMIN';
  }

  ngOnDestroy() {
    this.userServiceSubscriptions.unsubscribe();
    this.filterValueSubscription.unsubscribe();
  }

  redirectToHome() {
    this.changeActiveButton('HOME');
    this.router.navigate(['/home']);
  }

  redirectToUser() {
    this.changeActiveButton('USER');
    this.router.navigate(['/user']);
  }

  redirectToAdmin() {
    this.changeActiveButton('ADMIN');
    this.router.navigate(['/admin']);
  }

  changeActiveButton(text: string) {
    this.activeButton = text;
    if (this.userSearchRef) {
      this.userSearchRef.dismiss();
    }
  }

  openUserSearchDialog() {
    this.userSearchRef = this.snackBar.openFromComponent(SearchUserDialogComponent, {
      data: this.filterValue,
      panelClass: 'user-search-dialog'
    });
  }

  addNewUser() {
   this.popupDialog.open(AddUserDialogComponent, {
      width: '400px',
      height : '550px',
      panelClass : 'custom-dialog',
      data: null,
    });
  }

  clearFilters() {
    this.adminService.clearFilterObservable();
    if (this.userSearchRef) {
      this.userSearchRef.dismiss();
    }
  }
}
