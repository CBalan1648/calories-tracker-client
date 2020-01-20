import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, Subscription } from 'rxjs';
import { searchUserFormConfig } from 'src/app/helpers/objects.static';
import { AdminService } from 'src/app/services/admin.service';
import { SearchUserDialogComponent } from './search-user-dialog.component';


describe('SearchUserDialogComponent Template', () => {
    let component: SearchUserDialogComponent;
    let fixture: ComponentFixture<SearchUserDialogComponent>;


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
                MatSnackBarModule,
            ],
            declarations: [SearchUserDialogComponent],
            providers: [{
                provide: MatSnackBarRef,
                useClass: class { dismiss = jasmine.createSpy('dismiss'); }
            },
            {
                provide: MAT_SNACK_BAR_DATA,
                useClass: class { searchString: 'Hello'; searchAuthLevel: 'hello'; }
            },
            ]
        })
            .compileComponents();


    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchUserDialogComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('SearchUserDialogComponent button should call the close() method', () => {
        fixture.detectChanges();

        spyOn(component, 'close');

        const dismissButton = fixture.debugElement.query(By.css('button')).nativeElement;

        expect(component.close).toHaveBeenCalledTimes(0);

        dismissButton.click();

        expect(component.close).toHaveBeenCalledTimes(1);
    });

});

class MockAdminService {
    connectFilterObservable = (observable: Observable<any>) => {
        return observable.subscribe(() => { });
    }
    disconnectObservable = (subscription: Subscription) => {
        subscription.unsubscribe();
    }
}

class MockSnackBarRef {
    dismiss = () => void 0;
}


describe('SearchUserDialogComponent', () => {
    let component: SearchUserDialogComponent;
    let mockAdminService: AdminService;
    const mockFormBuilder: FormBuilder = new FormBuilder();
    const mockSnackBarRef: MatSnackBarRef<SearchUserDialogComponent> =
        new MockSnackBarRef() as unknown as MatSnackBarRef<SearchUserDialogComponent>;

    const mockData = { searchString: 'string', searchAuthLevel: 'string' };

    beforeEach(() => {
        mockAdminService = new MockAdminService() as unknown as AdminService;
        component = new SearchUserDialogComponent(mockFormBuilder, mockAdminService, mockSnackBarRef, mockData);
    });

    it('Should create a formGroup and assign to a field in ngOnInit', () => {
        expect(component.searchUserForm).toBeFalsy();

        spyOn(mockFormBuilder, 'group').and.callThrough();

        expect(mockFormBuilder.group).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(component.searchUserForm).toBeTruthy();

        expect(mockFormBuilder.group).toHaveBeenCalledTimes(1);
        expect(mockFormBuilder.group).toHaveBeenCalledWith(searchUserFormConfig(component.data));
    });

    it('Should connect observable to admin service in ngOnInit', () => {
        expect(component.filterSubscription).toBeFalsy();

        spyOn(mockAdminService, 'connectFilterObservable').and.callThrough();

        expect(mockAdminService.connectFilterObservable).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(component.searchUserForm).toBeTruthy();

        expect(mockAdminService.connectFilterObservable).toHaveBeenCalledTimes(1);

    });

    it('Should disconnect observable from admin service in ngOnDestroy', () => {
        component.ngOnInit();

        spyOn(mockAdminService, 'disconnectObservable').and.callThrough();

        expect(mockAdminService.disconnectObservable).toHaveBeenCalledTimes(0);

        component.ngOnDestroy();

        expect(mockAdminService.disconnectObservable).toHaveBeenCalledTimes(1);
        expect(mockAdminService.disconnectObservable).toHaveBeenCalledWith(component.filterSubscription);

    });

    it('Should unsubscribe from formChange observable in ngOnDestroy', () => {
        component.ngOnInit();

        spyOn(component.formChangeSubscription, 'unsubscribe').and.callThrough();

        expect(component.formChangeSubscription.unsubscribe).toHaveBeenCalledTimes(0);

        component.ngOnDestroy();

        expect(component.formChangeSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });


    it('Should call mockSnackBarRef.dismiss() in close()', () => {
        component.ngOnInit();

        spyOn(mockSnackBarRef, 'dismiss');

        expect(mockSnackBarRef.dismiss).toHaveBeenCalledTimes(0);

        component.close();

        expect(mockSnackBarRef.dismiss).toHaveBeenCalledTimes(1);
    });
});
