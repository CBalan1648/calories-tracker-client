import * as Imports from './app.imports';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './Helpers/jwt.interceptor';
import { ScrollingModule } from '@angular/cdk/scrolling';


const routes: Imports.Routes = [
  { path: 'login', component: Imports.LoginFormComponent, data: { title: 'Welcome to Calories Tracker' } },
  { path: 'register', component: Imports.RegisterFormComponent },
  { path: 'home', component: Imports.HomeComponent },
  { path: 'user', component: Imports.UserProfileComponent},
  { path: 'admin', component: Imports.AdminComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: Imports.PageNotFoundComponent }
];

@Imports.NgModule({
  declarations: [
    Imports.AppComponent,
    Imports.HeaderComponent,
    Imports.LoginFormComponent,
    Imports.RegisterFormComponent,
    Imports.PageNotFoundComponent,
    Imports.TopNotificationComponent,
    Imports.HomeComponent,
    Imports.MealsComponent,
    Imports.DashboardComponent,
    Imports.MealFormComponent,
    Imports.EditMealDialogComponent,
    Imports.FilterMenuComponent,
    Imports.UserProfileComponent,
    Imports.AdminComponent,
  ],
  imports: [
    Imports.RouterModule.forRoot(routes),
    Imports.BrowserModule,
    Imports.BrowserAnimationsModule,
    Imports.MatToolbarModule,
    Imports.ReactiveFormsModule,
    Imports.MatInputModule,
    Imports.MatButtonModule,
    Imports.MatExpansionModule,
    Imports.HttpClientModule,
    Imports.MatSidenavModule,
    Imports.MatTableModule,
    Imports.MatDialogModule,
    Imports.MatSelectModule,
    Imports.MatDatepickerModule,
    Imports.MatNativeDateModule,
    ScrollingModule,
    Imports.MatListModule,
  ],
  bootstrap: [Imports.AppComponent],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }],
  entryComponents: [Imports.EditMealDialogComponent]
})
export class AppModule { }
