import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AddMealDialogComponent } from './Components/add-meal-dialog/add-meal-dialog.component';
import { AddUserDialogComponent } from './Components/add-user-dialog/add-user-dialog.component';
import { AdminComponent } from './Components/admin/admin.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { EditMealDialogComponent } from './Components/edit-meal-dialog/edit-meal-dialog.component';
import { EditUserDialogComponent } from './Components/edit-user-dialog/edit-user-dialog.component';
import { FilterMenuComponent } from './Components/filter-menu/filter-menu.component';
import { HeaderComponent } from './Components/header/header.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginFormComponent } from './Components/login-form/login-form.component';
import { MealFormComponent } from './Components/meal-form/meal-form.component';
import { MealsComponent } from './Components/meals/meals.component';
import { PageNotFoundComponent } from './Components/page-not-found/page-not-found.component';
import { RegisterFormComponent } from './Components/register-form/register-form.component';
import { SearchUserDialogComponent } from './Components/search-user-dialog/search-user-dialog.component';
import { TopNotificationComponent } from './Components/top-notification/top-notification.component';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';

const routes: Routes = [
    { path: 'login', component: LoginFormComponent, data: { title: 'Welcome to Calories Tracker' } },
    { path: 'register', component: RegisterFormComponent },
    { path: 'home', component: HomeComponent },
    { path: 'user', component: UserProfileComponent },
    { path: 'admin', component: AdminComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

export const AppDeclarations = [
    AppComponent,
    HeaderComponent,
    LoginFormComponent,
    RegisterFormComponent,
    PageNotFoundComponent,
    TopNotificationComponent,
    HomeComponent,
    MealsComponent,
    DashboardComponent,
    MealFormComponent,
    EditMealDialogComponent,
    FilterMenuComponent,
    UserProfileComponent,
    AdminComponent,
    EditUserDialogComponent,
    AddUserDialogComponent,
    AddMealDialogComponent,
    SearchUserDialogComponent
];


export const AppImports = [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    HttpClientModule,
    MatSidenavModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatDividerModule,
    ScrollingModule,
    MatSnackBarModule,
];

export const EntryComponents = [
    EditMealDialogComponent,
    EditUserDialogComponent,
    AddUserDialogComponent,
    AddMealDialogComponent,
    SearchUserDialogComponent
];
