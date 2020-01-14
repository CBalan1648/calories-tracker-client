import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TopNotificationComponent } from './pages/shared/top-notification/top-notification.component';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogContainer, MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from './pages/shared/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatSidenavModule, MatToolbarModule,
        RouterTestingModule, HttpClientTestingModule,
        MatDialogModule, MatSnackBarModule,
        BrowserAnimationsModule],
      declarations: [
        AppComponent,
        HeaderComponent,
        TopNotificationComponent,
      ],
      providers: [{
        provide: Router,
        useClass: class { navigate = jasmine.createSpy('navigate'); }
      },
    {provide : APP_BASE_HREF, useValue: '/'}],
  
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    console.log(fixture)
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('calories-tracker-FE app is running!');
  });
});
