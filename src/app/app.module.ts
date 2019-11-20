import * as Imports from './app.imports';


const routes: Imports.Routes = [
  { path: 'login', component: Imports.LoginFormComponent, data: { title: 'Welcome to Calories Tracker' } },
  { path: 'register', component: Imports.RegisterFormComponent },
  { path: 'home', component: Imports.HomeComponent },
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
    Imports.MealsContainerComponent,
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
  ],
  bootstrap: [Imports.AppComponent]
})
export class AppModule { }
