import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginFormComponent } from './login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, Subscription } from 'rxjs';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, HttpClientTestingModule, MatInputModule, BrowserAnimationsModule],
      declarations: [LoginFormComponent],
      providers: [{
        provide: Router,
        useClass: class { navigate = jasmine.createSpy('navigate'); }
      }]
    })
      .compileComponents();


  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    console.log(fixture);
    expect(component).toBeTruthy();
  });

  it('LoginForm should be invalid because missing password', () => {

    component.loginForm.controls.email.setValue('test@test.test');
    component.loginForm.controls.password.setValue('');

    expect(component.loginForm.controls.email.errors).toBeFalsy();
    expect(component.loginForm.controls.password.errors).toBeTruthy();
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('LoginForm should be invalid because missing email', () => {

    component.loginForm.controls.email.setValue('');
    component.loginForm.controls.password.setValue('123123123123');

    expect(component.loginForm.controls.email.errors).toBeTruthy();
    expect(component.loginForm.controls.password.errors).toBeFalsy();
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('LoginForm should be invalid because invalid email', () => {

    component.loginForm.controls.email.setValue('test');
    component.loginForm.controls.password.setValue('123123123123');

    expect(component.loginForm.controls.email.errors).toBeTruthy();
    expect(component.loginForm.controls.password.errors).toBeFalsy();
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('LoginForm should be valid', () => {

    component.loginForm.controls.email.setValue('test@test.test');
    component.loginForm.controls.password.setValue('123');

    expect(component.loginForm.controls.email.errors).toBeFalsy();
    expect(component.loginForm.controls.password.errors).toBeFalsy();
    expect(component.loginForm.valid).toBeTruthy();
  });

});

class MockLoginService {
  public lastReceivedValue;
  connectRequestObservable = (obsevableSubject: Observable<any>) => {
    return obsevableSubject.subscribe(nextValue => this.lastReceivedValue = nextValue);
  }

  disconnectRequestObservable = (subscription: Subscription) => { subscription.unsubscribe(); };
  getValue = () => this.lastReceivedValue;
}
