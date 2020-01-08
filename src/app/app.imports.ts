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
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AddMealDialogComponent } from './pages/admin/components/add-meal-dialog/add-meal-dialog.component';
import { AddUserDialogComponent } from './pages/admin/components/add-user-dialog/add-user-dialog.component';
import { AdminComponent } from './pages/admin/admin.component';
import { DashboardComponent } from './pages/home/components/dashboard/dashboard.component';
import { EditMealDialogComponent } from './pages/shared/edit-meal-dialog/edit-meal-dialog.component';
import { EditUserDialogComponent } from './pages/admin/components/edit-user-dialog/edit-user-dialog.component';
import { FilterMenuComponent } from './pages/home/components/filter-menu/filter-menu.component';
import { HeaderComponent } from './pages/shared/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginFormComponent } from './pages/login/login.component';
import { MealFormComponent } from './pages/shared/meal-form/meal-form.component';
import { MealsComponent } from './pages/home/components/meals/meals.component';
import { PageNotFoundComponent } from './pages/not-found/not-found.component';
import { RegisterFormComponent } from './pages/register/register.component';
import { SearchUserDialogComponent } from './pages/admin/components/search-user-dialog/search-user-dialog.component';
import { TopNotificationComponent } from './pages/shared/top-notification/top-notification.component';
import { UserProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from './helpers/auth.guard';
import { WeekDayPipe } from './helpers/week-day.pipe';
import { GraphComponent } from './pages/home/components/graph/graph.component'; 

const routes: Routes = [
    { path: 'login', component: LoginFormComponent, data: { title: 'Welcome to Calories Tracker' } },
    { path: 'register', component: RegisterFormComponent },
    { path: 'home', canActivate: [AuthGuard], data: { roles: ['USER', 'USER_MANAGER', 'ADMIN'] }, component: HomeComponent },
    { path: 'user', canActivate: [AuthGuard], data: { roles: ['USER', 'USER_MANAGER', 'ADMIN'] }, component: UserProfileComponent },
    { path: 'admin', canActivate: [AuthGuard], data: { roles: ['USER_MANAGER', 'ADMIN'] }, component: AdminComponent },
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
    SearchUserDialogComponent,
    WeekDayPipe,
    GraphComponent,
];

export const AppImports = [
    RouterModule.forRoot(routes, { useHash: true }),
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
    MatSliderModule,
];

export const EntryComponents = [
    EditMealDialogComponent,
    EditUserDialogComponent,
    AddUserDialogComponent,
    AddMealDialogComponent,
    SearchUserDialogComponent
];
