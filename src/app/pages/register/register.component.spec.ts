import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { getRegisterFormFormValues, samePasswordValidator } from 'src/app/helpers/functions.static';
import { registerFormConfig } from 'src/app/helpers/objects.static';
import { RegisterService } from 'src/app/services/register.service';
import { AUTO_LOGIN_NOTIFICATION, TopNotificationService } from 'src/app/services/top-notification.service';
import { RegisterComponent } from './register.component';


describe('RegisterComponent Template', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                HttpClientTestingModule,
                MatInputModule,
                BrowserAnimationsModule
            ],
            declarations: [RegisterComponent],
            providers: [{
                provide: Router,
                useClass: class { navigate = jasmine.createSpy('navigate'); }
            },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
    });

    it('Should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('RegisterForm should be valid', () => {
        fixture.detectChanges();

        component.registerForm.controls.firstName.setValue('firstName');
        component.registerForm.controls.lastName.setValue('lastName');
        component.registerForm.controls.email.setValue('test@test.test');
        component.registerForm.controls.password.setValue('123123123123');
        component.registerForm.controls.repeatPassword.setValue('123123123123');

        expect(component.registerForm.controls.firstName.errors).toBeFalsy();
        expect(component.registerForm.controls.lastName.errors).toBeFalsy();
        expect(component.registerForm.controls.email.errors).toBeFalsy();
        expect(component.registerForm.controls.password.errors).toBeFalsy();
        expect(component.registerForm.controls.repeatPassword.errors).toBeFalsy();
        expect(component.registerForm.valid).toBeTruthy();
    });

    it('RegisterForm should be invalid because missing firstname', () => {
        fixture.detectChanges();

        component.registerForm.controls.firstName.setValue('');
        component.registerForm.controls.lastName.setValue('lastName');
        component.registerForm.controls.email.setValue('test@test.test');
        component.registerForm.controls.password.setValue('123123123123');
        component.registerForm.controls.repeatPassword.setValue('123123123123');

        expect(component.registerForm.controls.firstName.errors).toBeTruthy();
        expect(component.registerForm.controls.lastName.errors).toBeFalsy();
        expect(component.registerForm.controls.email.errors).toBeFalsy();
        expect(component.registerForm.controls.password.errors).toBeFalsy();
        expect(component.registerForm.controls.repeatPassword.errors).toBeFalsy();
        expect(component.registerForm.valid).toBeFalsy();
    });

    it('RegisterForm should be invalid because missing lastname', () => {
        fixture.detectChanges();

        component.registerForm.controls.firstName.setValue('firstName');
        component.registerForm.controls.lastName.setValue('');
        component.registerForm.controls.email.setValue('test@test.test');
        component.registerForm.controls.password.setValue('123123123123');
        component.registerForm.controls.repeatPassword.setValue('123123123123');

        expect(component.registerForm.controls.firstName.errors).toBeFalsy();
        expect(component.registerForm.controls.lastName.errors).toBeTruthy();
        expect(component.registerForm.controls.email.errors).toBeFalsy();
        expect(component.registerForm.controls.password.errors).toBeFalsy();
        expect(component.registerForm.controls.repeatPassword.errors).toBeFalsy();
        expect(component.registerForm.valid).toBeFalsy();
    });

    it('RegisterForm should be invalid because missing email', () => {
        fixture.detectChanges();

        component.registerForm.controls.firstName.setValue('firstName');
        component.registerForm.controls.lastName.setValue('lastName');
        component.registerForm.controls.email.setValue('');
        component.registerForm.controls.password.setValue('123123123123');
        component.registerForm.controls.repeatPassword.setValue('123123123123');

        expect(component.registerForm.controls.firstName.errors).toBeFalsy();
        expect(component.registerForm.controls.lastName.errors).toBeFalsy();
        expect(component.registerForm.controls.email.errors).toBeTruthy();
        expect(component.registerForm.controls.password.errors).toBeFalsy();
        expect(component.registerForm.controls.repeatPassword.errors).toBeFalsy();
        expect(component.registerForm.valid).toBeFalsy();
    });

    it('RegisterForm should be invalid because invalid email', () => {
        fixture.detectChanges();

        component.registerForm.controls.firstName.setValue('firstName');
        component.registerForm.controls.lastName.setValue('lastName');
        component.registerForm.controls.email.setValue('hello');
        component.registerForm.controls.password.setValue('123123123123');
        component.registerForm.controls.repeatPassword.setValue('123123123123');

        expect(component.registerForm.controls.firstName.errors).toBeFalsy();
        expect(component.registerForm.controls.lastName.errors).toBeFalsy();
        expect(component.registerForm.controls.email.errors).toBeTruthy();
        expect(component.registerForm.controls.password.errors).toBeFalsy();
        expect(component.registerForm.controls.repeatPassword.errors).toBeFalsy();
        expect(component.registerForm.valid).toBeFalsy();
    });

    it('RegisterForm should be invalid because missing password', () => {
        fixture.detectChanges();

        component.registerForm.controls.firstName.setValue('firstName');
        component.registerForm.controls.lastName.setValue('lastName');
        component.registerForm.controls.email.setValue('test@test.test');
        component.registerForm.controls.password.setValue('');
        component.registerForm.controls.repeatPassword.setValue('123123123123');

        expect(component.registerForm.controls.firstName.errors).toBeFalsy();
        expect(component.registerForm.controls.lastName.errors).toBeFalsy();
        expect(component.registerForm.controls.email.errors).toBeFalsy();
        expect(component.registerForm.controls.password.errors).toBeTruthy();
        expect(component.registerForm.controls.repeatPassword.errors).toBeFalsy();
        expect(component.registerForm.valid).toBeFalsy();
    });

    it('RegisterForm should be invalid because missing repeatPassword', () => {
        fixture.detectChanges();

        component.registerForm.controls.firstName.setValue('firstName');
        component.registerForm.controls.lastName.setValue('lastName');
        component.registerForm.controls.email.setValue('test@test.test');
        component.registerForm.controls.password.setValue('123123123123');
        component.registerForm.controls.repeatPassword.setValue('');

        expect(component.registerForm.controls.firstName.errors).toBeFalsy();
        expect(component.registerForm.controls.lastName.errors).toBeFalsy();
        expect(component.registerForm.controls.email.errors).toBeFalsy();
        expect(component.registerForm.controls.password.errors).toBeFalsy();
        expect(component.registerForm.controls.repeatPassword.errors).toBeTruthy();
        expect(component.registerForm.valid).toBeFalsy();
    });

    it('RegisterForm should be invalid because repeatPassword does not match with password', () => {
        fixture.detectChanges();

        component.registerForm.controls.firstName.setValue('firstName');
        component.registerForm.controls.lastName.setValue('lastName');
        component.registerForm.controls.email.setValue('test@test.test');
        component.registerForm.controls.password.setValue('123123123123');
        component.registerForm.controls.repeatPassword.setValue('456456456456');

        expect(component.registerForm.controls.firstName.errors).toBeFalsy();
        expect(component.registerForm.controls.lastName.errors).toBeFalsy();
        expect(component.registerForm.controls.email.errors).toBeFalsy();
        expect(component.registerForm.controls.password.errors).toBeFalsy();
        expect(component.registerForm.controls.repeatPassword.errors).toBeFalsy();
        expect(component.registerForm.valid).toBeFalsy();
    });


    it('RegisterForm should be invalid because repeatPassword does not match with password', () => {
        fixture.detectChanges();

        spyOn(component, 'submitForm');

        const submitButton = fixture.debugElement.query(By.css('button')).nativeElement;

        submitButton.click();

        expect(component.submitForm).toHaveBeenCalledTimes(1);
    });

});

class MockRegisterService {
    public lastReceivedValue;
    connectRequestObservable = (obsevableSubject: Observable<any>) => {
        return obsevableSubject.subscribe();
    }

    disconnectRequestObservable = (subscription: Subscription) => { subscription.unsubscribe(); };
}

class MockTopNotificationService {
    setMessage = () => { };
}

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    const mockRegisterService: RegisterService = new MockRegisterService() as unknown as RegisterService;
    const mockFormBuilder: FormBuilder = new FormBuilder();
    const mockTopNotificationService: TopNotificationService = new MockTopNotificationService() as unknown as TopNotificationService;

    beforeEach(() => {
        component = new RegisterComponent(mockFormBuilder, mockRegisterService, mockTopNotificationService);
    });

    it('Should instantiace the form with the correct configuration', () => {
        spyOn(mockFormBuilder, 'group').and.callThrough();

        expect(mockFormBuilder.group).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(mockFormBuilder.group).toHaveBeenCalledTimes(1);
        expect(mockFormBuilder.group).toHaveBeenCalledWith(registerFormConfig, { validators: samePasswordValidator });
    });


    it('Should call registerService.connectRequestObservable on ngOnInit', () => {
        spyOn(mockRegisterService, 'connectRequestObservable');

        expect(mockRegisterService.connectRequestObservable).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(mockRegisterService.connectRequestObservable).toHaveBeenCalledTimes(1);
        expect(mockRegisterService.connectRequestObservable).toHaveBeenCalledWith(component.observableSubject);
    });


    it('Should call registerService.disconnectRequestObservable on ngOnDestroy', () => {
        spyOn(mockRegisterService, 'disconnectRequestObservable');

        expect(mockRegisterService.disconnectRequestObservable).toHaveBeenCalledTimes(0);

        component.ngOnInit();
        component.ngOnDestroy();

        expect(mockRegisterService.disconnectRequestObservable).toHaveBeenCalledTimes(1);
        expect(mockRegisterService.disconnectRequestObservable).toHaveBeenCalledWith(component.observableSubscription);
    });

    it('Should not call next on subject if form is not VALID', () => {
        spyOn(component.observableSubject, 'next');

        expect(component.observableSubject.next).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        component.registerForm.controls.firstName.setValue('');
        component.registerForm.controls.lastName.setValue('lastName');
        component.registerForm.controls.email.setValue('test@test.test');
        component.registerForm.controls.password.setValue('123123123123');
        component.registerForm.controls.repeatPassword.setValue('123123123123');

        component.submitForm();

        expect(component.observableSubject.next).toHaveBeenCalledTimes(0);
    });

    it('Should call next on subject if form is VALID', () => {
        spyOn(component.observableSubject, 'next');

        expect(component.observableSubject.next).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        component.registerForm.controls.firstName.setValue('firstName');
        component.registerForm.controls.lastName.setValue('lastName');
        component.registerForm.controls.email.setValue('test@test.test');
        component.registerForm.controls.password.setValue('123123123123');
        component.registerForm.controls.repeatPassword.setValue('123123123123');

        component.submitForm();

        const formBuilder = new FormBuilder();
        const copyForm = formBuilder.group(registerFormConfig);

        copyForm.controls.firstName.setValue('firstName');
        copyForm.controls.lastName.setValue('lastName');
        copyForm.controls.email.setValue('test@test.test');
        copyForm.controls.password.setValue('123123123123');
        copyForm.controls.repeatPassword.setValue('123123123123');


        expect(component.observableSubject.next).toHaveBeenCalledTimes(1);
        expect(component.observableSubject.next).toHaveBeenCalledWith([getRegisterFormFormValues(copyForm), true]);
    });

    it('Should not call topNotificaitionService with the AUTO_LOGIN_NOTIFICATION', () => {
        spyOn(mockTopNotificationService, 'setMessage');

        expect(mockTopNotificationService.setMessage).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        component.registerForm.controls.firstName.setValue('firstName');
        component.registerForm.controls.lastName.setValue('lastName');
        component.registerForm.controls.email.setValue('test@test.test');
        component.registerForm.controls.password.setValue('123123123123');
        component.registerForm.controls.repeatPassword.setValue('123123123123');

        component.submitForm();

        expect(mockTopNotificationService.setMessage).toHaveBeenCalledTimes(1);
        expect(mockTopNotificationService.setMessage).toHaveBeenCalledWith(AUTO_LOGIN_NOTIFICATION);
    });

});
