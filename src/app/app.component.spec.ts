import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/shared/header/header.component';
import { TopNotificationComponent } from './pages/shared/top-notification/top-notification.component';

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
      { provide: APP_BASE_HREF, useValue: '/' }],

    }).compileComponents();
  }));

  it('Should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
