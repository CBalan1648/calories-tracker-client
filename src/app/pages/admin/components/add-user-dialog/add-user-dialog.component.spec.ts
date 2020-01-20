import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { getRegisterFormFormValuesAdmin } from 'src/app/helpers/functions.static';
import { addUserFormConfig } from 'src/app/helpers/objects.static';
import { AdminService } from 'src/app/services/admin.service';
import { RegisterService } from 'src/app/services/register.service';
import { AddUserDialogComponent } from './add-user-dialog.component';

describe('AddUserDialogComponent Template', () => {
    let component: AddUserDialogComponent;
    let fixture: ComponentFixture<AddUserDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                HttpClientTestingModule,
                MatInputModule,
                BrowserAnimationsModule,
                MatOptionModule,
                MatSelectModule,
            ],
            declarations: [AddUserDialogComponent],
            providers: [{
                provide: Router,
                useClass: class { navigate = jasmine.createSpy('navigate'); }
            },
            {
                provide: MatDialogRef,
                useClass: class { close = jasmine.createSpy('close'); }
            },
            {
                provide: MAT_DIALOG_DATA,
                useClass: class { userId: 192412; }
            },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddUserDialogComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('AddUserForm should be valid', () => {
        fixture.detectChanges();

        component.addUserForm.controls.firstName.setValue('firstName');
        component.addUserForm.controls.lastName.setValue('lastName');
        component.addUserForm.controls.email.setValue('test@test.test');
        component.addUserForm.controls.password.setValue('123123123123');
        component.addUserForm.controls.authLevel.setValue('USER');

        expect(component.addUserForm.controls.firstName.errors).toBeFalsy();
        expect(component.addUserForm.controls.lastName.errors).toBeFalsy();
        expect(component.addUserForm.controls.email.errors).toBeFalsy();
        expect(component.addUserForm.controls.password.errors).toBeFalsy();
        expect(component.addUserForm.controls.authLevel.errors).toBeFalsy();
        expect(component.addUserForm.valid).toBeTruthy();
    });

    it('AddUserForm should be invalid because missing firstname', () => {
        fixture.detectChanges();

        component.addUserForm.controls.firstName.setValue('');
        component.addUserForm.controls.lastName.setValue('lastName');
        component.addUserForm.controls.email.setValue('test@test.test');
        component.addUserForm.controls.password.setValue('123123123123');
        component.addUserForm.controls.authLevel.setValue('USER');

        expect(component.addUserForm.controls.firstName.errors).toBeTruthy();
        expect(component.addUserForm.controls.lastName.errors).toBeFalsy();
        expect(component.addUserForm.controls.email.errors).toBeFalsy();
        expect(component.addUserForm.controls.password.errors).toBeFalsy();
        expect(component.addUserForm.controls.authLevel.errors).toBeFalsy();
        expect(component.addUserForm.valid).toBeFalsy();
    });

    it('AddUserForm should be invalid because missing lastname', () => {
        fixture.detectChanges();

        component.addUserForm.controls.firstName.setValue('firstName');
        component.addUserForm.controls.lastName.setValue('');
        component.addUserForm.controls.email.setValue('test@test.test');
        component.addUserForm.controls.password.setValue('123123123123');
        component.addUserForm.controls.authLevel.setValue('USER');

        expect(component.addUserForm.controls.firstName.errors).toBeFalsy();
        expect(component.addUserForm.controls.lastName.errors).toBeTruthy();
        expect(component.addUserForm.controls.email.errors).toBeFalsy();
        expect(component.addUserForm.controls.password.errors).toBeFalsy();
        expect(component.addUserForm.controls.authLevel.errors).toBeFalsy();
        expect(component.addUserForm.valid).toBeFalsy();
    });

    it('AddUserForm should be invalid because missing email', () => {
        fixture.detectChanges();

        component.addUserForm.controls.firstName.setValue('firstName');
        component.addUserForm.controls.lastName.setValue('lastName');
        component.addUserForm.controls.email.setValue('');
        component.addUserForm.controls.password.setValue('123123123123');
        component.addUserForm.controls.authLevel.setValue('USER');

        expect(component.addUserForm.controls.firstName.errors).toBeFalsy();
        expect(component.addUserForm.controls.lastName.errors).toBeFalsy();
        expect(component.addUserForm.controls.email.errors).toBeTruthy();
        expect(component.addUserForm.controls.password.errors).toBeFalsy();
        expect(component.addUserForm.controls.authLevel.errors).toBeFalsy();
        expect(component.addUserForm.valid).toBeFalsy();
    });

    it('AddUserForm should be invalid because invalid email', () => {
        fixture.detectChanges();

        component.addUserForm.controls.firstName.setValue('firstName');
        component.addUserForm.controls.lastName.setValue('lastName');
        component.addUserForm.controls.email.setValue('hello');
        component.addUserForm.controls.password.setValue('123123123123');
        component.addUserForm.controls.authLevel.setValue('USER');

        expect(component.addUserForm.controls.firstName.errors).toBeFalsy();
        expect(component.addUserForm.controls.lastName.errors).toBeFalsy();
        expect(component.addUserForm.controls.email.errors).toBeTruthy();
        expect(component.addUserForm.controls.password.errors).toBeFalsy();
        expect(component.addUserForm.controls.authLevel.errors).toBeFalsy();
        expect(component.addUserForm.valid).toBeFalsy();
    });

    it('AddUserForm should be invalid because missing password', () => {
        fixture.detectChanges();

        component.addUserForm.controls.firstName.setValue('firstName');
        component.addUserForm.controls.lastName.setValue('lastName');
        component.addUserForm.controls.email.setValue('test@test.test');
        component.addUserForm.controls.password.setValue('');
        component.addUserForm.controls.authLevel.setValue('USER');

        expect(component.addUserForm.controls.firstName.errors).toBeFalsy();
        expect(component.addUserForm.controls.lastName.errors).toBeFalsy();
        expect(component.addUserForm.controls.email.errors).toBeFalsy();
        expect(component.addUserForm.controls.password.errors).toBeTruthy();
        expect(component.addUserForm.controls.authLevel.errors).toBeFalsy();
        expect(component.addUserForm.valid).toBeFalsy();
    });

    it('AddUserForm should be invalid because password does not meet requirements', () => {
        fixture.detectChanges();

        component.addUserForm.controls.firstName.setValue('firstName');
        component.addUserForm.controls.lastName.setValue('lastName');
        component.addUserForm.controls.email.setValue('test@test.test');
        component.addUserForm.controls.password.setValue('123');
        component.addUserForm.controls.authLevel.setValue('USER');

        expect(component.addUserForm.controls.firstName.errors).toBeFalsy();
        expect(component.addUserForm.controls.lastName.errors).toBeFalsy();
        expect(component.addUserForm.controls.email.errors).toBeFalsy();
        expect(component.addUserForm.controls.password.errors).toBeTruthy();
        expect(component.addUserForm.controls.authLevel.errors).toBeFalsy();
        expect(component.addUserForm.valid).toBeFalsy();
    });

    it('AddUserForm should be valid because authLevel has no validators', () => {
        fixture.detectChanges();

        component.addUserForm.controls.firstName.setValue('firstName');
        component.addUserForm.controls.lastName.setValue('lastName');
        component.addUserForm.controls.email.setValue('test@test.test');
        component.addUserForm.controls.password.setValue('123123123123');
        component.addUserForm.controls.authLevel.setValue('USER');

        expect(component.addUserForm.controls.firstName.errors).toBeFalsy();
        expect(component.addUserForm.controls.lastName.errors).toBeFalsy();
        expect(component.addUserForm.controls.email.errors).toBeFalsy();
        expect(component.addUserForm.controls.password.errors).toBeFalsy();
        expect(component.addUserForm.controls.authLevel.errors).toBeFalsy();
        expect(component.addUserForm.valid).toBeTruthy();
    });

    it('AddUserForm should be submitted on button click', () => {
        fixture.detectChanges();

        spyOn(component, 'submitForm');

        const submitButton = fixture.debugElement.query(By.css('button')).nativeElement;

        submitButton.click();

        expect(component.submitForm).toHaveBeenCalledTimes(1);
    });
});

class MockRegisterService {
    public lastReceivedValue;
    connectRequestObservableAdmin = (observable: Observable<any>) => {
        return observable.subscribe();
    }

    disconnectRequestObservable = (subscription: Subscription) => { subscription.unsubscribe(); };
}

class MockAdminService {
    connectFilterObservable = (observable: Observable<any>) => {
        return observable.subscribe(() => { });
    }
    disconnectObservable = (subscription: Subscription) => {
        subscription.unsubscribe();
    }
    getUsers = () => { };
}

class MockDialogRef {
    close = () => void 0;
}

describe('AddUserDialogComponent', () => {
    let component: AddUserDialogComponent;
    const mockRegisterService: RegisterService = new MockRegisterService() as unknown as RegisterService;
    const mockFormBuilder: FormBuilder = new FormBuilder();
    const mockAdminService: AdminService = new MockAdminService() as unknown as AdminService;
    const mockDialogRef: MatDialogRef<AddUserDialogComponent> =
        new MockDialogRef() as unknown as MatDialogRef<AddUserDialogComponent>;

    beforeEach(() => {
        component = new AddUserDialogComponent(mockFormBuilder, mockRegisterService, mockAdminService, mockDialogRef, {});
    });

    it('Should instantiace the form with the correct configuration', () => {
        expect(component.addUserForm).toBeFalsy();

        spyOn(mockFormBuilder, 'group').and.callThrough();

        expect(mockFormBuilder.group).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(component.addUserForm).toBeTruthy();
        expect(mockFormBuilder.group).toHaveBeenCalledTimes(1);
        expect(mockFormBuilder.group).toHaveBeenCalledWith(addUserFormConfig);
    });

    it('Should call registerService.connectRequestObservableAdmin on ngOnInit', () => {

        expect(component.observableSubscription).toBeFalsy();
        spyOn(mockRegisterService, 'connectRequestObservableAdmin').and.callThrough();

        expect(mockRegisterService.connectRequestObservableAdmin).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(component.observableSubscription).toBeTruthy();
        expect(mockRegisterService.connectRequestObservableAdmin).toHaveBeenCalledTimes(1);
        expect(mockRegisterService.connectRequestObservableAdmin).toHaveBeenCalledWith(component.observableSubject);
    });

    it('Should call registerService.connectRequestObservableAdmin on ngOnInit', () => {
        component.ngOnInit();

        spyOn(component.observableSubject, 'next').and.callThrough();

        component.addUserForm.controls.firstName.setValue('firstName');
        component.addUserForm.controls.lastName.setValue('lastName');
        component.addUserForm.controls.email.setValue('test@test.test');
        component.addUserForm.controls.password.setValue('123123123123');
        component.addUserForm.controls.authLevel.setValue('USER');

        expect(component.observableSubject.next).toHaveBeenCalledTimes(0);

        component.submitForm();

        expect(component.observableSubject.next).toHaveBeenCalledTimes(1);
        expect(component.observableSubject.next).toHaveBeenCalledWith([getRegisterFormFormValuesAdmin(component.addUserForm), false]);
    });

    it('Should call adminService.getUsers() on submitForm(VALID)', () => {
        component.ngOnInit();

        spyOn(mockAdminService, 'getUsers');

        component.addUserForm.controls.firstName.setValue('firstName');
        component.addUserForm.controls.lastName.setValue('lastName');
        component.addUserForm.controls.email.setValue('test@test.test');
        component.addUserForm.controls.password.setValue('123123123123');
        component.addUserForm.controls.authLevel.setValue('USER');

        expect(mockAdminService.getUsers).toHaveBeenCalledTimes(0);

        component.submitForm();

        expect(mockAdminService.getUsers).toHaveBeenCalledTimes(1);
    });

    it('Should not call onClose() on submitForm(INVALID)', () => {
        component.ngOnInit();

        spyOn(component, 'onClose');

        component.addUserForm.controls.firstName.setValue('');
        component.addUserForm.controls.lastName.setValue('');
        component.addUserForm.controls.email.setValue('');
        component.addUserForm.controls.password.setValue('');
        component.addUserForm.controls.authLevel.setValue('');

        expect(component.addUserForm.status).toBe('INVALID');

        expect(component.onClose).toHaveBeenCalledTimes(0);

        component.submitForm();

        expect(component.onClose).toHaveBeenCalledTimes(0);
    });

    it('Should call onClose() on submitForm(VALID)', () => {
        component.ngOnInit();

        spyOn(component, 'onClose');

        component.addUserForm.controls.firstName.setValue('firstName');
        component.addUserForm.controls.lastName.setValue('lastName');
        component.addUserForm.controls.email.setValue('test@test.test');
        component.addUserForm.controls.password.setValue('123123123123');
        component.addUserForm.controls.authLevel.setValue('USER');

        expect(component.onClose).toHaveBeenCalledTimes(0);

        component.submitForm();

        expect(component.onClose).toHaveBeenCalledTimes(1);
    });

    it('Should call mockDialogRef.close() in onClose()', () => {

        component.ngOnInit();

        spyOn(mockDialogRef, 'close');

        expect(mockDialogRef.close).toHaveBeenCalledTimes(0);

        component.onClose();

        expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    });
});


