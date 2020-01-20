import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MealFormComponent } from 'src/app/pages/shared/meal-form/meal-form.component';
import { MealsService } from 'src/app/services/meals.service';
import { AddMealDialogComponent } from './add-meal-dialog.component';


describe('AddMealDialogComponent Template', () => {
    let component: AddMealDialogComponent;
    let fixture: ComponentFixture<AddMealDialogComponent>;


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
                MatDialogModule,
            ],
            declarations: [AddMealDialogComponent, MealFormComponent],
            providers: [{
                provide: MatDialogRef,
                useClass: class { close = jasmine.createSpy('close'); }
            },
            {
                provide: MAT_DIALOG_DATA,
                useClass: class { userId: 192412; }
            },
            {
                provide: Router,
                useClass: class { navigate = jasmine.createSpy('navigate'); }
            },
            ]
        })
            .compileComponents();


    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddMealDialogComponent);
        component = fixture.componentInstance;
    });

    it('Should create AddMealDialogComponent', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

});

class MockMealsService {
    connectRequestObservable = (observable: Observable<any>) => {
        return observable.subscribe(() => { });
    }
    disconnectRequestObservable = (subscription: Subscription) => {
        subscription.unsubscribe();
    }
}

class MockDialogRef {
    close = () => void 0;
}


describe('AddMealDialogComponent', () => {
    let component: AddMealDialogComponent;
    let mockMealsService: MealsService;
    const mockDialogRef: MatDialogRef<AddMealDialogComponent> =
        new MockDialogRef() as unknown as MatDialogRef<AddMealDialogComponent>;

    const mockUserId = 'aaa111aaa222aaa333';

    beforeEach(() => {
        mockMealsService = new MockMealsService() as unknown as MealsService;
        component = new AddMealDialogComponent(mockMealsService, mockDialogRef, mockUserId);
    });

    it('Should connect to mealsService in ngOnInit', () => {
        expect(component.observableSubscription).toBeFalsy();

        spyOn(mockMealsService, 'connectRequestObservable').and.callThrough();

        expect(mockMealsService.connectRequestObservable).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(component.observableSubscription).toBeTruthy();

        expect(mockMealsService.connectRequestObservable).toHaveBeenCalledTimes(1);
        expect(mockMealsService.connectRequestObservable).toHaveBeenCalledWith(component.observableSubject);
    });

    it('Should disconnect from mealsService in ngOnDestroy', () => {

        component.ngOnInit();

        expect(component.observableSubscription).toBeTruthy();

        spyOn(mockMealsService, 'disconnectRequestObservable').and.callThrough();

        expect(mockMealsService.disconnectRequestObservable).toHaveBeenCalledTimes(0);

        component.ngOnDestroy();

        expect(mockMealsService.disconnectRequestObservable).toHaveBeenCalledTimes(1);
        expect(mockMealsService.disconnectRequestObservable).toHaveBeenCalledWith(component.observableSubscription);
    });

    it('Should emit a new value in onSubmitNewMeal', () => {

        component.ngOnInit();

        const testMeal = { title: 'title', time: 123012312, calories: 123, description: '' };

        spyOn(component.observableSubject, 'next').and.callThrough();

        expect(component.observableSubject.next).toHaveBeenCalledTimes(0);

        component.onSubmitNewMeal(testMeal);

        expect(component.observableSubject.next).toHaveBeenCalledTimes(1);
        expect(component.observableSubject.next).toHaveBeenCalledWith([testMeal, component.userId]);
    });


    it('Should call mockDialogRef.close() in onClose()', () => {

        component.ngOnInit();

        spyOn(mockDialogRef, 'close');

        expect(mockDialogRef.close).toHaveBeenCalledTimes(0);

        component.onClose();

        expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    });

});
