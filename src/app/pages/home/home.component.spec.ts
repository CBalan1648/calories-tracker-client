import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { WeekDayPipe } from 'src/app/helpers/week-day.pipe';
import { MealsService } from 'src/app/services/meals.service';
import { MealFormComponent } from '../shared/meal-form/meal-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FilterMenuComponent } from './components/filter-menu/filter-menu.component';
import { MealsComponent } from './components/meals/meals.component';
import { HomeComponent } from './home.component';

// Using NO_ERRORS_SCHEMA to reduce the number of imports

describe('HomeComponent Template', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                HttpClientTestingModule,
                MatInputModule,
                BrowserAnimationsModule,
                MatDialogModule,
                ScrollingModule,
                MatSelectModule
            ],
            declarations: [
                HomeComponent,
                DashboardComponent,
                FilterMenuComponent,
                MealFormComponent,
                MealsComponent,
                WeekDayPipe
            ],
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
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
    });

    it('Should Create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});

class MockMealService {
    connectRequestObservable = (observable: Observable<any>) => {
        return observable.subscribe();
    }

    disconnectRequestObservable = (subscription: Subscription) => {
        subscription.unsubscribe();
    }
}

describe('HomeComponent', () => {
    let component: HomeComponent;
    const mockMealsService: MealsService = new MockMealService() as unknown as MealsService;

    beforeEach(() => {
        component = new HomeComponent(mockMealsService);
    });

    it('Should connect the observable to mealService in ngOnInit', () => {
        spyOn(mockMealsService, 'connectRequestObservable').and.callThrough();

        expect(component.observableSubscription).toBeFalsy();
        expect(mockMealsService.connectRequestObservable).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(component.observableSubscription).toBeTruthy();
        expect(mockMealsService.connectRequestObservable).toHaveBeenCalledTimes(1);
        expect(mockMealsService.connectRequestObservable).toHaveBeenCalledWith(component.observableSubject);
    });

    it('Should disconnect from mealService in ngOnDestroy', () => {

        component.ngOnInit();
        spyOn(mockMealsService, 'disconnectRequestObservable').and.callThrough();

        expect(component.observableSubscription).toBeTruthy();
        expect(mockMealsService.disconnectRequestObservable).toHaveBeenCalledTimes(0);

        component.ngOnDestroy();

        expect(mockMealsService.disconnectRequestObservable).toHaveBeenCalledTimes(1);
        expect(mockMealsService.disconnectRequestObservable).toHaveBeenCalledWith(component.observableSubscription);
    });

    it('Should emit a new value from the subject on onSubmitNewMeal', () => {

        const testMeal = { title: 'title', time: 123012312, calories: 123, description: '' };
        spyOn(component.observableSubject, 'next').and.callThrough();

        expect(component.observableSubject.next).toHaveBeenCalledTimes(0);

        component.onSubmitNewMeal(testMeal);

        expect(component.observableSubject.next).toHaveBeenCalledTimes(1);
        expect(component.observableSubject.next).toHaveBeenCalledWith([testMeal]);
    });
});
