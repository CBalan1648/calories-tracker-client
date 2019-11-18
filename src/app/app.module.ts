import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginFormComponent } from './Components/login-form/login-form.component';
import { MealsComponent } from './components/meals/meals.component';
import { PageNotFoundComponent } from './Components/page-not-found/page-not-found.component';
import { RegisterFormComponent } from './Components/register-form/register-form.component';
import { TopNotificationComponent } from './components/top-notification/top-notification.component';


const routes: Routes = [
  { path: 'login', component: LoginFormComponent, data: { title: 'Welcome to Calories Tracker' } },
  { path: 'register', component: RegisterFormComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginFormComponent,
    RegisterFormComponent,
    PageNotFoundComponent,
    TopNotificationComponent,
    HomeComponent,
    MealsComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
