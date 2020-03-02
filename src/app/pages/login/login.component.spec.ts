import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { loginFormConfig } from 'src/app/helpers/objects.static';
import { LoginService } from 'src/app/services/login.service';
import { LoginFormComponent } from './login.component';

describe('LoginFormComponent Template', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, HttpClientTestingModule, MatInputModule, BrowserAnimationsModule],
      declarations: [LoginFormComponent],
      providers: [{
        provide: Router,
        useClass: class { navigate = jasmine.createSpy('navigate'); }
      },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
  });

  it('Should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('LoginForm should be invalid because missing password', () => {
    fixture.detectChanges();

    component.loginForm.controls.email.setValue('test@test.test');
    component.loginForm.controls.password.setValue('');

    expect(component.loginForm.controls.email.errors).toBeFalsy();
    expect(component.loginForm.controls.password.errors).toBeTruthy();
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('LoginForm should be invalid because missing email', () => {
    fixture.detectChanges();

    component.loginForm.controls.email.setValue('');
    component.loginForm.controls.password.setValue('123123123123');

    expect(component.loginForm.controls.email.errors).toBeTruthy();
    expect(component.loginForm.controls.password.errors).toBeFalsy();
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('LoginForm should be invalid because invalid email', () => {
    fixture.detectChanges();

    component.loginForm.controls.email.setValue('test');
    component.loginForm.controls.password.setValue('123123123123');

    expect(component.loginForm.controls.email.errors).toBeTruthy();
    expect(component.loginForm.controls.password.errors).toBeFalsy();
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('LoginForm should be valid', () => {
    fixture.detectChanges();

    component.loginForm.controls.email.setValue('test@test.test');
    component.loginForm.controls.password.setValue('123');

    expect(component.loginForm.controls.email.errors).toBeFalsy();
    expect(component.loginForm.controls.password.errors).toBeFalsy();
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('LoginForm submit should be called', () => {
    fixture.detectChanges();

    component.loginForm.controls.email.setValue('test@test.test');
    component.loginForm.controls.password.setValue('123');

    spyOn(component, 'submitForm');

    const submitButton = fixture.debugElement.query(By.css('.login-button-group button')).nativeElement;

    submitButton.click();

    expect(component.submitForm).toHaveBeenCalledTimes(1);
  });

  it('Register button should link to register page', () => {
    fixture.detectChanges();

    component.loginForm.controls.email.setValue('test@test.test');
    component.loginForm.controls.password.setValue('123');

    const registerLink = fixture.debugElement.query(By.css('.login-button-group a')).nativeElement.getAttribute('routerlink');

    expect(registerLink).toEqual('/register');
  });
});

class MockLoginService {
  public lastReceivedValue;
  connectRequestObservable = (obsevableSubject: Observable<any>) => {
    return obsevableSubject.subscribe();
  }

  disconnectRequestObservable = (subscription: Subscription) => { subscription.unsubscribe(); };
}

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  const mockLoginService: LoginService = new MockLoginService() as unknown as LoginService;
  const mockFormBuilder: FormBuilder = new FormBuilder();

  beforeEach(() => {
    component = new LoginFormComponent(mockFormBuilder, mockLoginService);
  });

  it('Should call loginService.connectRequestObservable on ngOnInit', () => {
    spyOn(mockLoginService, 'connectRequestObservable');

    expect(mockLoginService.connectRequestObservable).toHaveBeenCalledTimes(0);

    component.ngOnInit();

    expect(mockLoginService.connectRequestObservable).toHaveBeenCalledTimes(1);
    expect(mockLoginService.connectRequestObservable).toHaveBeenCalledWith(component.observableSubject);
  });

  it('Should call formBuilder.group on ngOnInit', () => {
    spyOn(mockFormBuilder, 'group');

    expect(mockFormBuilder.group).toHaveBeenCalledTimes(0);

    component.ngOnInit();

    expect(mockFormBuilder.group).toHaveBeenCalledTimes(1);
    expect(mockFormBuilder.group).toHaveBeenCalledWith(loginFormConfig);
  });

  it('Should call loginService.disconnectRequestObservable on ngOnDestroy', () => {
    spyOn(mockLoginService, 'disconnectRequestObservable');

    expect(mockLoginService.disconnectRequestObservable).toHaveBeenCalledTimes(0);

    component.ngOnInit();
    component.ngOnDestroy();

    expect(mockLoginService.disconnectRequestObservable).toHaveBeenCalledTimes(1);
    expect(mockLoginService.disconnectRequestObservable).toHaveBeenCalledWith(component.observableSubscription);
  });

  it('Should call next on subject if form is VALID', () => {
    spyOn(component.observableSubject, 'next');

    expect(component.observableSubject.next).toHaveBeenCalledTimes(0);

    component.ngOnInit();
    component.loginForm.controls.email.setValue('test@test.test');
    component.loginForm.controls.password.setValue('123');

    component.submitForm();

    expect(component.observableSubject.next).toHaveBeenCalledTimes(1);
    expect(component.observableSubject.next).toHaveBeenCalledWith({ email: 'test@test.test', password: '123' });
  });

  it('Should not call next on subject if form is not VALID', () => {
    spyOn(component.observableSubject, 'next');

    expect(component.observableSubject.next).toHaveBeenCalledTimes(0);

    component.ngOnInit();
    component.loginForm.controls.email.setValue('');
    component.loginForm.controls.password.setValue('');
    component.submitForm();

    expect(component.observableSubject.next).toHaveBeenCalledTimes(0);
  });
});
