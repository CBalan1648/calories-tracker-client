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
import { getEditUserFormValues } from 'src/app/helpers/functions.static';
import { editUserFormConfig } from 'src/app/helpers/objects.static';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import { EditUserDialogComponent } from './edit-user-dialog.component';

describe('EditUserDialogComponent Template', () => {
    let component: EditUserDialogComponent;
    let fixture: ComponentFixture<EditUserDialogComponent>;

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
            declarations: [EditUserDialogComponent],
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
        fixture = TestBed.createComponent(EditUserDialogComponent);
        component = fixture.componentInstance;
    });

    it('Should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('editUserForm should be valid', () => {
        fixture.detectChanges();

        component.editUserForm.controls.firstName.setValue('firstName');
        component.editUserForm.controls.lastName.setValue('lastName');
        component.editUserForm.controls.email.setValue('test@test.test');
        component.editUserForm.controls.targetCalories.setValue('123');
        component.editUserForm.controls.authLevel.setValue('USER');

        expect(component.editUserForm.controls.firstName.errors).toBeFalsy();
        expect(component.editUserForm.controls.lastName.errors).toBeFalsy();
        expect(component.editUserForm.controls.email.errors).toBeFalsy();
        expect(component.editUserForm.controls.targetCalories.errors).toBeFalsy();
        expect(component.editUserForm.controls.authLevel.errors).toBeFalsy();
        expect(component.editUserForm.valid).toBeTruthy();
    });

    it('editUserForm should be invalid because missing firstname', () => {
        fixture.detectChanges();

        component.editUserForm.controls.firstName.setValue('');
        component.editUserForm.controls.lastName.setValue('lastName');
        component.editUserForm.controls.email.setValue('test@test.test');
        component.editUserForm.controls.targetCalories.setValue('123');
        component.editUserForm.controls.authLevel.setValue('USER');

        expect(component.editUserForm.controls.firstName.errors).toBeTruthy();
        expect(component.editUserForm.controls.lastName.errors).toBeFalsy();
        expect(component.editUserForm.controls.email.errors).toBeFalsy();
        expect(component.editUserForm.controls.targetCalories.errors).toBeFalsy();
        expect(component.editUserForm.controls.authLevel.errors).toBeFalsy();
        expect(component.editUserForm.valid).toBeFalsy();
    });

    it('editUserForm should be invalid because missing lastname', () => {
        fixture.detectChanges();

        component.editUserForm.controls.firstName.setValue('firstName');
        component.editUserForm.controls.lastName.setValue('');
        component.editUserForm.controls.email.setValue('test@test.test');
        component.editUserForm.controls.targetCalories.setValue('123');
        component.editUserForm.controls.authLevel.setValue('USER');

        expect(component.editUserForm.controls.firstName.errors).toBeFalsy();
        expect(component.editUserForm.controls.lastName.errors).toBeTruthy();
        expect(component.editUserForm.controls.email.errors).toBeFalsy();
        expect(component.editUserForm.controls.targetCalories.errors).toBeFalsy();
        expect(component.editUserForm.controls.authLevel.errors).toBeFalsy();
        expect(component.editUserForm.valid).toBeFalsy();
    });

    it('editUserForm should not be valid because missing email', () => {
        fixture.detectChanges();

        component.editUserForm.controls.firstName.setValue('firstName');
        component.editUserForm.controls.lastName.setValue('lastName');
        component.editUserForm.controls.email.setValue('');
        component.editUserForm.controls.targetCalories.setValue('123');
        component.editUserForm.controls.authLevel.setValue('USER');

        expect(component.editUserForm.controls.firstName.errors).toBeFalsy();
        expect(component.editUserForm.controls.lastName.errors).toBeFalsy();
        expect(component.editUserForm.controls.email.errors).toBeTruthy();
        expect(component.editUserForm.controls.targetCalories.errors).toBeFalsy();
        expect(component.editUserForm.controls.authLevel.errors).toBeFalsy();
        expect(component.editUserForm.valid).toBeFalsy();
    });

    it('editUserForm should be invalid because missing targetCalories', () => {
        fixture.detectChanges();

        component.editUserForm.controls.firstName.setValue('firstName');
        component.editUserForm.controls.lastName.setValue('lastName');
        component.editUserForm.controls.email.setValue('test@test.test');
        component.editUserForm.controls.targetCalories.setValue(null);
        component.editUserForm.controls.authLevel.setValue('USER');

        expect(component.editUserForm.controls.firstName.errors).toBeFalsy();
        expect(component.editUserForm.controls.lastName.errors).toBeFalsy();
        expect(component.editUserForm.controls.email.errors).toBeFalsy();
        expect(component.editUserForm.controls.targetCalories.errors).toBeTruthy();
        expect(component.editUserForm.controls.authLevel.errors).toBeFalsy();
        expect(component.editUserForm.valid).toBeFalsy();
    });

    it('editUserForm should be valid because authLevel has no validators', () => {
        fixture.detectChanges();

        component.editUserForm.controls.firstName.setValue('firstName');
        component.editUserForm.controls.lastName.setValue('lastName');
        component.editUserForm.controls.email.setValue('test@test.test');
        component.editUserForm.controls.targetCalories.setValue('123123123123');
        component.editUserForm.controls.authLevel.setValue('USER');

        expect(component.editUserForm.controls.firstName.errors).toBeFalsy();
        expect(component.editUserForm.controls.lastName.errors).toBeFalsy();
        expect(component.editUserForm.controls.email.errors).toBeFalsy();
        expect(component.editUserForm.controls.targetCalories.errors).toBeFalsy();
        expect(component.editUserForm.controls.authLevel.errors).toBeFalsy();
        expect(component.editUserForm.valid).toBeTruthy();
    });

    it('editUserForm should be submitted on button click', () => {
        fixture.detectChanges();

        spyOn(component, 'submitForm');

        const submitButton = fixture.debugElement.query(By.css('button')).nativeElement;

        submitButton.click();

        expect(component.submitForm).toHaveBeenCalledTimes(1);
    });
});

class MockAdminService {
    connectEditUserRequestObservable = (observable: Observable<any>) => {
        return observable.subscribe(() => { });
    }
    disconnectObservable = (subscription: Subscription) => {
        subscription.unsubscribe();
    }
}

class MockDialogRef {
    close = () => void 0;
}

describe('EditUserDialogComponent', () => {
    let component: EditUserDialogComponent;
    const mockFormBuilder: FormBuilder = new FormBuilder();
    const mockAdminService: AdminService = new MockAdminService() as unknown as AdminService;
    const mockDialogRef: MatDialogRef<EditUserDialogComponent> =
        new MockDialogRef() as unknown as MatDialogRef<EditUserDialogComponent>;

    const editedUser: User = {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'test@test.test',
        _id: 'aaa111aaa222aaa333aaa',
        token: 'JWT',
        authLevel: 'USER',
        targetCalories: 123
    };

    beforeEach(() => {
        component = new EditUserDialogComponent(mockFormBuilder, mockAdminService, mockDialogRef, editedUser);
    });

    it('Should instantiace the form with the correct configuration', () => {
        expect(component.editUserForm).toBeFalsy();

        spyOn(mockFormBuilder, 'group').and.callThrough();

        expect(mockFormBuilder.group).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(component.editUserForm).toBeTruthy();
        expect(mockFormBuilder.group).toHaveBeenCalledTimes(1);
        expect(mockFormBuilder.group).toHaveBeenCalledWith(editUserFormConfig(component.userData));
    });

    it('Should call adminService.userObservableSubscription on ngOnInit', () => {

        expect(component.userObservableSubscription).toBeFalsy();
        spyOn(mockAdminService, 'connectEditUserRequestObservable').and.callThrough();

        expect(mockAdminService.connectEditUserRequestObservable).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(component.userObservableSubscription).toBeTruthy();
        expect(mockAdminService.connectEditUserRequestObservable).toHaveBeenCalledTimes(1);
        expect(mockAdminService.connectEditUserRequestObservable).toHaveBeenCalledWith(component.userObservableSubject);
    });

    it('Should call adminService.disconnectObservable on ngOnDestroy', () => {

        component.ngOnInit();

        spyOn(mockAdminService, 'disconnectObservable').and.callThrough();

        expect(mockAdminService.disconnectObservable).toHaveBeenCalledTimes(0);

        component.ngOnDestroy();

        expect(mockAdminService.disconnectObservable).toHaveBeenCalledTimes(1);
        expect(mockAdminService.disconnectObservable).toHaveBeenCalledWith(component.userObservableSubscription);
    });

    it('Should call emit a new value to the subscipted adminService on submitForm(VALID)', () => {
        component.ngOnInit();

        spyOn(component.userObservableSubject, 'next');

        component.editUserForm.controls.firstName.setValue('firstName');
        component.editUserForm.controls.lastName.setValue('lastName');
        component.editUserForm.controls.email.setValue('test@test.test');
        component.editUserForm.controls.targetCalories.setValue('123');
        component.editUserForm.controls.authLevel.setValue('USER');

        expect(component.userObservableSubject.next).toHaveBeenCalledTimes(0);

        component.submitForm();

        expect(component.userObservableSubject.next).toHaveBeenCalledTimes(1);
        expect(component.userObservableSubject.next).toHaveBeenCalledWith(
            getEditUserFormValues(component.editUserForm, component.userData)
        );
    });

    it('Should not call onClose() on submitForm(INVALID)', () => {
        component.ngOnInit();

        spyOn(component, 'onClose');

        component.editUserForm.controls.firstName.setValue('');
        component.editUserForm.controls.lastName.setValue('');
        component.editUserForm.controls.email.setValue('');
        component.editUserForm.controls.targetCalories.setValue('');
        component.editUserForm.controls.authLevel.setValue('');

        expect(component.editUserForm.status).toBe('INVALID');

        expect(component.onClose).toHaveBeenCalledTimes(0);

        component.submitForm();

        expect(component.onClose).toHaveBeenCalledTimes(0);
    });

    it('Should call onClose() on submitForm(VALID)', () => {
        component.ngOnInit();

        spyOn(component, 'onClose');

        component.editUserForm.controls.firstName.setValue('firstName');
        component.editUserForm.controls.lastName.setValue('lastName');
        component.editUserForm.controls.email.setValue('test@test.test');
        component.editUserForm.controls.targetCalories.setValue('123');
        component.editUserForm.controls.authLevel.setValue('USER');

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
