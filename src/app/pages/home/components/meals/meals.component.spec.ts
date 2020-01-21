import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { editMealDialogConfig } from 'src/app/helpers/objects.static';
import { WeekDayPipe } from 'src/app/helpers/week-day.pipe';
import { Meal } from 'src/app/models/meal';
import { User } from 'src/app/models/user';
import { EditMealDialogComponent } from 'src/app/pages/shared/edit-meal-dialog/edit-meal-dialog.component';
import { MealsService } from 'src/app/services/meals.service';
import { UserService } from 'src/app/services/user.service';
import { MealsComponent } from './meals.component';

const testMeal = { _id: 'aaa111aaa22', title: 'mealTitle', time: 123012312, calories: 123, description: '', overCal: true };
const testMeal2 = { _id: 'aaa111aaa22', title: 'mealTitle2', time: 123012312, calories: 123, description: '', overCal: false };

const testMealsArray = [testMeal, testMeal2];

describe('MealsComponent Template', () => {
    let component: MealsComponent;
    let fixture: ComponentFixture<MealsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                HttpClientTestingModule,
                MatInputModule,
                BrowserAnimationsModule,
                MatListModule,
                ScrollingModule,
                MatDialogModule,
            ],
            declarations: [MealsComponent, WeekDayPipe],
            providers: [
                {
                    provide: Router,
                    useClass: class { navigate = jasmine.createSpy('navigate'); }
                },
                {
                    provide: MealsService,
                    useClass: class {
                        getFilteredMealObservable = () => {
                            return new BehaviorSubject<Meal[]>(testMealsArray);
                        }
                        deleteMealRequest = () => { };
                        getMeals = () => { };
                    }
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
        fixture = TestBed.createComponent(MealsComponent);
        component = fixture.componentInstance;
    });

    it('Should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('Should render an item with the red-bg class', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        const redListItem = fixture.debugElement.query(By.css('.meals-scroll-viewport .red-bg'));

        expect(redListItem).toBeTruthy();
    }));

    it('Should render an item with the green-bg class', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        const greenListItem = fixture.debugElement.query(By.css('.meals-scroll-viewport .green-bg'));

        expect(greenListItem).toBeTruthy();
    }));


    it('Should render the meal title in the table row', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        const titleText = fixture.debugElement.query(By.css('.meals-scroll-viewport .red-bg .title')).nativeElement.innerText.trim();

        expect(titleText).toEqual(testMeal.title);
    }));

    it('Should render the meal description in the table row', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        const descriptionText = fixture.debugElement.query(
            By.css('.meals-scroll-viewport .red-bg .description')
        ).nativeElement.innerText.trim();

        expect(descriptionText).toEqual(testMeal.description);
    }));

    it('Should render the meal time in the table row', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        const timeText = fixture.debugElement.query(By.css('.meals-scroll-viewport .red-bg .time')).nativeElement.innerText.trim();

        expect(timeText).toBeTruthy();
    }));

    it('Should render the meal calories in the table row', fakeAsync(() => {

        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        const caloriesText = fixture.debugElement.query(By.css('.meals-scroll-viewport .red-bg .calories')).nativeElement.innerText.trim();

        expect(caloriesText).toEqual(testMeal.calories.toString());
    }));

    it('Edit Button should call the openEditDialog method when onClick', fakeAsync(() => {

        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();
        spyOn(component, 'openEditDialog');

        expect(component.openEditDialog).toHaveBeenCalledTimes(0);

        const editButton = fixture.debugElement.query(By.css('.meals-scroll-viewport .red-bg .actions')).childNodes[0].nativeNode;

        expect(editButton).toBeTruthy();

        editButton.click();

        expect(component.openEditDialog).toHaveBeenCalledTimes(1);
        expect(component.openEditDialog).toHaveBeenCalledWith(testMeal);
    }));

    it('Delete Button should call the deleteMeal method onClick', fakeAsync(() => {

        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();
        spyOn(component, 'deleteMeal');

        expect(component.deleteMeal).toHaveBeenCalledTimes(0);

        const editButton = fixture.debugElement.query(By.css('.meals-scroll-viewport .red-bg .actions')).childNodes[1].nativeNode;

        expect(editButton).toBeTruthy();

        editButton.click();

        expect(component.deleteMeal).toHaveBeenCalledTimes(1);
        expect(component.deleteMeal).toHaveBeenCalledWith(testMeal._id);
    }));
});


const testUser = { _id: '123' } as User;

class MockMealsService {
    subject = new BehaviorSubject<Meal[]>(testMealsArray);
    getFilteredMealObservable = () => {
        return this.subject;
    }

    deleteMealRequest = () => { };
    getMeals = () => { };
}

class MockDialog {
    open = () => { };
}


class MockUserService {
    subject = new BehaviorSubject<User>(testUser);
    getUserObservable = () => {
        return this.subject;
    }
}


describe('MealsComponent', () => {
    let component: MealsComponent;
    let mockMealsService: MealsService;
    let mockUserService: UserService;
    const mockDialog: MatDialog = new MockDialog() as unknown as MatDialog;

    beforeEach(() => {
        mockMealsService = new MockMealsService() as unknown as MealsService;
        mockUserService = new MockUserService() as unknown as UserService;
        component = new MealsComponent(mockMealsService, mockDialog, mockUserService);
    });

    it('Should call mealService.getMeals on ngOnInit', () => {
        spyOn(mockMealsService, 'getMeals');

        expect(mockMealsService.getMeals).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(mockMealsService.getMeals).toHaveBeenCalledTimes(1);
    });

    it('Should call mealService.getFilteredMealObservable on ngOnInit', () => {
        spyOn(mockMealsService, 'getFilteredMealObservable').and.callThrough();

        expect(component.mealsObservableSubscription).toBeFalsy();
        expect(component.meals).toBeFalsy();

        expect(mockMealsService.getFilteredMealObservable).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(component.mealsObservableSubscription).toBeTruthy();
        expect(component.meals).toEqual(testMealsArray);
        expect(mockMealsService.getFilteredMealObservable).toHaveBeenCalledTimes(1);
    });

    it('Should call userService.getUserObservable on ngOnInit', () => {
        spyOn(mockUserService, 'getUserObservable').and.callThrough();

        expect(component.userServiceSubscription).toBeFalsy();
        expect(component.user).toBeFalsy();

        expect(mockUserService.getUserObservable).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(component.userServiceSubscription).toBeTruthy();
        expect(component.user).toEqual(testUser);
        expect(mockUserService.getUserObservable).toHaveBeenCalledTimes(1);
    });

    it('Should call open on the meal dialog with the correct configuration', () => {
        component.user = testUser;

        spyOn(mockDialog, 'open');

        expect(mockDialog.open).toHaveBeenCalledTimes(0);

        component.openEditDialog(testMeal);

        expect(mockDialog.open).toHaveBeenCalledTimes(1);
        expect(mockDialog.open).toHaveBeenCalledWith(EditMealDialogComponent, editMealDialogConfig(testMeal, component.user._id));
    });

    it('Should unsubscribe from user observable on ngOnDestory', () => {

        component.ngOnInit();

        spyOn(component.userServiceSubscription, 'unsubscribe').and.callThrough();

        expect(component.userServiceSubscription).toBeTruthy();
        expect(component.userServiceSubscription.unsubscribe).toHaveBeenCalledTimes(0);

        component.ngOnDestroy();

        expect(component.userServiceSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('Should unsubscribe from meal observable on ngOnDestory', () => {

        component.ngOnInit();

        spyOn(component.mealsObservableSubscription, 'unsubscribe').and.callThrough();

        expect(component.mealsObservableSubscription).toBeTruthy();
        expect(component.mealsObservableSubscription.unsubscribe).toHaveBeenCalledTimes(0);

        component.ngOnDestroy();

        expect(component.mealsObservableSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });
});
