import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { MealsStats } from 'src/app/helpers/interfaces';
import { ABORT_STRING, EDIT_STRING, SAVE_STRING } from 'src/app/helpers/string';
import { User } from 'src/app/models/user';
import { MealsService } from 'src/app/services/meals.service';
import { PROFILE_UPDATE_SUCCESSFUL, TopNotificationService } from 'src/app/services/top-notification.service';
import { UserService } from 'src/app/services/user.service';
import * as staticFunctions from '../../helpers/functions.static';
import { initialMealStats, userProfileFormConfig } from '../../helpers/objects.static';
import { ProfileComponent } from './profile.component';


describe('ProfileComponent Template', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                HttpClientTestingModule,
                MatInputModule,
                BrowserAnimationsModule],
            declarations: [ProfileComponent],
            providers: [{
                provide: Router,
                useClass: class { navigate = jasmine.createSpy('navigate'); }
            },
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
    });

    it('Should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('Should display the user name', () => {

        const firstName = 'firstName';
        const lastName = 'lastName';

        fixture.detectChanges();

        component.user = { firstName, lastName } as User;

        fixture.detectChanges();

        const profileHeader = fixture.debugElement.query(By.css('.profile-title')).nativeElement.innerHTML.trim();


        expect(profileHeader.includes(firstName)).toBeTruthy();
        expect(profileHeader.includes(lastName)).toBeTruthy();
    });

    it('UserProfileForm should be DISABLED', () => {

        fixture.detectChanges();

        expect(component.userProfileForm.status).toBe('DISABLED');
    });


    it('UserProfileForm should be valid', () => {

        fixture.detectChanges();
        component.edit();

        component.userProfileForm.controls.firstName.setValue('firstName');
        component.userProfileForm.controls.lastName.setValue('lastName');
        component.userProfileForm.controls.email.setValue('test@test.test');
        component.userProfileForm.controls.targetCalories.setValue(123);


        expect(component.userProfileForm.controls.firstName.errors).toBeFalsy();
        expect(component.userProfileForm.controls.lastName.errors).toBeFalsy();
        expect(component.userProfileForm.controls.email.errors).toBeFalsy();
        expect(component.userProfileForm.controls.targetCalories.errors).toBeFalsy();

        expect(component.userProfileForm.valid).toBeTruthy();
    });


    it('UserProfileForm should be invalid beacuse firstName is missing', () => {

        fixture.detectChanges();
        component.edit();

        component.userProfileForm.controls.firstName.setValue('');
        component.userProfileForm.controls.lastName.setValue('lastName');
        component.userProfileForm.controls.email.setValue('test@test.test');
        component.userProfileForm.controls.targetCalories.setValue(123);

        expect(component.userProfileForm.controls.firstName.errors).toBeTruthy();
        expect(component.userProfileForm.controls.lastName.errors).toBeFalsy();
        expect(component.userProfileForm.controls.email.errors).toBeFalsy();
        expect(component.userProfileForm.controls.targetCalories.errors).toBeFalsy();

        expect(component.userProfileForm.valid).toBeFalsy();
    });

    it('UserProfileForm should be invalid beacuse lastName is missing', () => {

        fixture.detectChanges();
        component.edit();

        component.userProfileForm.controls.firstName.setValue('firstName');
        component.userProfileForm.controls.lastName.setValue('');
        component.userProfileForm.controls.email.setValue('test@test.test');
        component.userProfileForm.controls.targetCalories.setValue(123);

        expect(component.userProfileForm.controls.firstName.errors).toBeFalsy();
        expect(component.userProfileForm.controls.lastName.errors).toBeTruthy();
        expect(component.userProfileForm.controls.email.errors).toBeFalsy();
        expect(component.userProfileForm.controls.targetCalories.errors).toBeFalsy();

        expect(component.userProfileForm.valid).toBeFalsy();
    });

    it('UserProfileForm should be valid beacuse email is missing but has no validatos', () => {

        fixture.detectChanges();
        component.edit();

        component.userProfileForm.controls.firstName.setValue('firstName');
        component.userProfileForm.controls.lastName.setValue('lastName');
        component.userProfileForm.controls.email.setValue('');
        component.userProfileForm.controls.targetCalories.setValue(123);

        expect(component.userProfileForm.controls.firstName.errors).toBeFalsy();
        expect(component.userProfileForm.controls.lastName.errors).toBeFalsy();
        expect(component.userProfileForm.controls.email.errors).toBeFalsy();
        expect(component.userProfileForm.controls.targetCalories.errors).toBeFalsy();

        expect(component.userProfileForm.valid).toBeTruthy();
    });

    it('UserProfileForm email field should be always disabled', () => {

        fixture.detectChanges();
        component.edit();

        expect(component.userProfileForm.controls.email.status).toBe('DISABLED');
    });


    it('UserProfileForm should be invalid beacuse targetCalories is missing', () => {

        fixture.detectChanges();
        component.edit();

        component.userProfileForm.controls.firstName.setValue('firstName');
        component.userProfileForm.controls.lastName.setValue('lastName');
        component.userProfileForm.controls.email.setValue('test@test.test');
        component.userProfileForm.controls.targetCalories.setValue(null);

        expect(component.userProfileForm.controls.firstName.errors).toBeFalsy();
        expect(component.userProfileForm.controls.lastName.errors).toBeFalsy();
        expect(component.userProfileForm.controls.email.errors).toBeFalsy();
        expect(component.userProfileForm.controls.targetCalories.errors).toBeTruthy();

        expect(component.userProfileForm.valid).toBeFalsy();
    });

    it('Should display the "edit" button', () => {
        fixture.detectChanges();

        const editButton = fixture.debugElement.query(By.css('.profile-buttons .edit-button')).nativeElement;
        const editButtonString = editButton.innerHTML.trim();

        expect(editButton).toBeTruthy();
        expect(editButtonString).toEqual(EDIT_STRING);
    });

    it('Should not display the "Abort" button', () => {
        fixture.detectChanges();

        const abortButton = fixture.debugElement.query(By.css('.profile-buttons .abort-button'));

        expect(abortButton).toBeFalsy();
    });

    it('Should display the "Abort" button after calling edit()', () => {
        fixture.detectChanges();

        component.edit();

        fixture.detectChanges();

        const abortButton = fixture.debugElement.query(By.css('.profile-buttons .abort-button')).nativeElement;
        const abortButtonString = abortButton.innerHTML.trim();

        expect(abortButton).toBeTruthy();
        expect(abortButtonString).toEqual(ABORT_STRING);
    });

    it('Should change "edit" to "save" after calling edit()', () => {
        fixture.detectChanges();

        component.edit();

        fixture.detectChanges();

        const editButton = fixture.debugElement.query(By.css('.profile-buttons .edit-button')).nativeElement;
        const editButtonString = editButton.innerHTML.trim();

        expect(editButton).toBeTruthy();
        expect(editButtonString).toEqual(SAVE_STRING);
    });

    it('Should render correnct strings and stats from the component stats objects', () => {

        fixture.detectChanges();

        const strings = {
            totalMeals: 'Total Meals',
            totalCalories: 'Total Calories',
            averageCalories: 'Average Calories',
            mealsAboveTarget: 'Meals over the calories target (Bad)',
            mealsBelowTarget: 'Meals below the calories target (Good)',
            mostCaloricMealTitle: 'Most caloric Meal',
            leastCaloricMealTitle: 'Least caloric Meal',
        };

        const testMealStats: MealsStats = {
            totalMeals: 1,
            totalCalories: 2,
            averageCalories: '0.25',

            mealsAboveTarget: 3,
            mealsBelowTarget: 4,

            mostCaloricMealTitle: 'testMostCaloricMeal',
            mostCaloricMealCalories: 2222,

            leastCaloricMealTitle: 'testLeastCaloriMeal',
            leastCaloricMealCalories: 15
        };

        component.stats = testMealStats;

        fixture.detectChanges();

        const totalMealsHTML = fixture.debugElement.query(By.css('.profile-stats')).childNodes[0].nativeNode.innerText;
        const totalCaloriesHTML = fixture.debugElement.query(By.css('.profile-stats')).childNodes[1].nativeNode.innerText;
        const averageCaloriesHTML = fixture.debugElement.query(By.css('.profile-stats')).childNodes[2].nativeNode.innerText;
        const mealsAboveTargetHTML = fixture.debugElement.query(By.css('.profile-stats')).childNodes[3].nativeNode.innerText;
        const mealsBelowTargetHTML = fixture.debugElement.query(By.css('.profile-stats')).childNodes[4].nativeNode.innerText;
        const mostCaloricMealHTML = fixture.debugElement.query(By.css('.profile-stats')).childNodes[5].nativeNode.innerText;
        const leastCaloricMealHTML = fixture.debugElement.query(By.css('.profile-stats')).childNodes[6].nativeNode.innerText;

        expect(totalMealsHTML.includes(strings.totalMeals) && totalMealsHTML.includes(testMealStats.totalMeals)).toBeTruthy();
        expect(totalCaloriesHTML.includes(strings.totalCalories) && totalCaloriesHTML.includes(testMealStats.totalCalories)).toBeTruthy();

        expect(averageCaloriesHTML.includes(strings.averageCalories) &&
            averageCaloriesHTML.includes(testMealStats.averageCalories)).toBeTruthy();

        expect(mealsAboveTargetHTML.includes(strings.mealsAboveTarget) &&
            mealsAboveTargetHTML.includes(testMealStats.mealsAboveTarget)).toBeTruthy();

        expect(mealsBelowTargetHTML.includes(strings.mealsBelowTarget) &&
            mealsBelowTargetHTML.includes(testMealStats.mealsBelowTarget)).toBeTruthy();

        expect(mostCaloricMealHTML.includes(strings.mostCaloricMealTitle) &&
            mostCaloricMealHTML.includes(testMealStats.mostCaloricMealTitle)).toBeTruthy();

        expect(mostCaloricMealHTML.includes(testMealStats.mostCaloricMealCalories)).toBeTruthy();

        expect(leastCaloricMealHTML.includes(strings.leastCaloricMealTitle) &&
            leastCaloricMealHTML.includes(testMealStats.leastCaloricMealTitle)).toBeTruthy();

        expect(leastCaloricMealHTML.includes(testMealStats.leastCaloricMealCalories)).toBeTruthy();
    });
});

const defaultUserId = 'HELLO';

class MockUserService {
    public behaviourSubject = new BehaviorSubject({ _id: defaultUserId });
    public lastReceivedValue;
    connectRequestObservable = (obsevableSubject: Observable<any>) => {
        return obsevableSubject.subscribe();
    }
    disconnectRequestObservable = (subscription: Subscription) => { subscription.unsubscribe(); };
    getUserObservable = () => {
        return this.behaviourSubject;
    }
}

class MockTopNotificationService {
    setMessage = (message: string) => { };
}

class MockMealsService {
    public subject = new Subject();
    getRawObservable = () => {
        return this.subject;
    }
}

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let mockUserService: UserService;
    const mockTopNotificationService: TopNotificationService = new MockTopNotificationService() as unknown as TopNotificationService;
    const mockMealsService: MealsService = new MockMealsService() as unknown as MealsService;
    const mockFormBuilder: FormBuilder = new FormBuilder();

    beforeEach(() => {
        mockUserService = new MockUserService() as unknown as UserService;
        component = new ProfileComponent(mockFormBuilder, mockUserService, mockTopNotificationService, mockMealsService);
    });

    it('Should call formBuilder.group on ngOnInit', () => {
        spyOn(mockFormBuilder, 'group').and.callThrough();

        expect(mockFormBuilder.group).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(mockFormBuilder.group).toHaveBeenCalledTimes(1);
        expect(mockFormBuilder.group).toHaveBeenCalledWith(userProfileFormConfig);
    });

    it('Should call userService.connectRequestObservable on ngOnInit', () => {
        spyOn(mockUserService, 'connectRequestObservable').and.callThrough();

        expect(mockUserService.connectRequestObservable).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(mockUserService.connectRequestObservable).toHaveBeenCalledTimes(1);
        expect(mockUserService.connectRequestObservable).toHaveBeenCalledWith(component.editUserObservableSubject);
        expect(component.editUserObservableSubscription instanceof Subscription).toBeTruthy();
    });

    it('Should call userService.getUserObservable on ngOnInit', () => {
        spyOn(mockUserService, 'getUserObservable').and.callThrough();

        expect(mockUserService.getUserObservable).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(mockUserService.getUserObservable).toHaveBeenCalledTimes(1);
        expect(component.userObservableSubscription instanceof Subscription).toBeTruthy();
    });


    it('Should call userService.getUserObservable on ngOnInit', () => {
        spyOn(mockUserService, 'getUserObservable').and.callThrough();

        expect(mockUserService.getUserObservable).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(mockUserService.getUserObservable).toHaveBeenCalledTimes(1);
        expect(component.userObservableSubscription instanceof Subscription).toBeTruthy();
    });

    it('Should call resetForm() on user observable values', () => {
        spyOn(component, 'resetForm');
        const user = { _id: '123123123' };
        (mockUserService as unknown as MockUserService).behaviourSubject.next(user);

        expect(component.resetForm).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(component.resetForm).toHaveBeenCalledTimes(1);
        expect(component.resetForm).toHaveBeenCalledWith(user);
    });


    it('Should set the "user" fieldwith user observable values', () => {
        const user = { _id: '123123123' };
        (mockUserService as unknown as MockUserService).behaviourSubject.next(user);

        expect(component.user !== user).toBeTruthy();

        component.ngOnInit();

        expect(component.user === user).toBeTruthy();

    });


    it('Should filter falsy user observable values', () => {
        const user = { _id: '123123123' };
        const falsyUser = void 0;
        (mockUserService as unknown as MockUserService).behaviourSubject.next(user);

        expect(component.user !== user).toBeTruthy();

        component.ngOnInit();

        expect(component.user === user).toBeTruthy();

        (mockUserService as unknown as MockUserService).behaviourSubject.next(falsyUser);

        expect(component.user === user).toBeTruthy();
    });

    it('Should call userService.getUserObservable on ngOnInit', () => {
        spyOn(mockMealsService, 'getRawObservable').and.callThrough();

        expect(mockMealsService.getRawObservable).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(mockMealsService.getRawObservable).toHaveBeenCalledTimes(1);
        expect(mockMealsService.getRawObservable).toHaveBeenCalledWith(defaultUserId);
        expect(component.mealsObservableSubscription instanceof Subscription).toBeTruthy();
    });


    it('Should call userService.getUserObservable on ngOnInit', () => {

        const returnedMealStats = { ...initialMealStats, mostCaloricMealTitle: 'test' };

        const generateMealStatsSpy = jasmine.createSpy('generateMealStatsSpy').and.callFake((a, b) => returnedMealStats);

        spyOnProperty(staticFunctions, 'generateMealStats').and.returnValue(generateMealStatsSpy);

        const mockMealsValue = [{ a: 'something here' }, { a: 'another Something' }];

        component.ngOnInit();

        (mockMealsService as unknown as MockMealsService).subject.next(mockMealsValue);

        expect(staticFunctions.generateMealStats).toHaveBeenCalledWith(mockMealsValue, initialMealStats);

        expect(component.stats).toEqual(returnedMealStats);
    });

    it('Should enable the selected form fields on enableFormEditing()', () => {

        component.ngOnInit();

        spyOn(component.userProfileForm.controls.firstName, 'enable');
        spyOn(component.userProfileForm.controls.lastName, 'enable');
        spyOn(component.userProfileForm.controls.targetCalories, 'enable');

        expect(component.userProfileForm.controls.firstName.enable).toHaveBeenCalledTimes(0);
        expect(component.userProfileForm.controls.lastName.enable).toHaveBeenCalledTimes(0);
        expect(component.userProfileForm.controls.targetCalories.enable).toHaveBeenCalledTimes(0);

        component.enableFormEditing();

        expect(component.userProfileForm.controls.firstName.enable).toHaveBeenCalledTimes(1);
        expect(component.userProfileForm.controls.lastName.enable).toHaveBeenCalledTimes(1);
        expect(component.userProfileForm.controls.targetCalories.enable).toHaveBeenCalledTimes(1);

    });


    it('Should disable the selected form fields on disableFormEditing()', () => {

        component.ngOnInit();

        spyOn(component.userProfileForm.controls.firstName, 'disable');
        spyOn(component.userProfileForm.controls.lastName, 'disable');
        spyOn(component.userProfileForm.controls.targetCalories, 'disable');

        expect(component.userProfileForm.controls.firstName.disable).toHaveBeenCalledTimes(0);
        expect(component.userProfileForm.controls.lastName.disable).toHaveBeenCalledTimes(0);
        expect(component.userProfileForm.controls.targetCalories.disable).toHaveBeenCalledTimes(0);

        component.disableFormEditing();

        expect(component.userProfileForm.controls.firstName.disable).toHaveBeenCalledTimes(1);
        expect(component.userProfileForm.controls.lastName.disable).toHaveBeenCalledTimes(1);
        expect(component.userProfileForm.controls.targetCalories.disable).toHaveBeenCalledTimes(1);

    });

    it('Should set the selected form fields on with the user data on resetForm(user)', () => {

        const testUser = {
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
            targetCalories: 123
        };

        component.ngOnInit();

        spyOn(component.userProfileForm.controls.firstName, 'setValue');
        spyOn(component.userProfileForm.controls.lastName, 'setValue');
        spyOn(component.userProfileForm.controls.targetCalories, 'setValue');
        spyOn(component.userProfileForm.controls.email, 'setValue');

        expect(component.userProfileForm.controls.firstName.setValue).toHaveBeenCalledTimes(0);
        expect(component.userProfileForm.controls.lastName.setValue).toHaveBeenCalledTimes(0);
        expect(component.userProfileForm.controls.targetCalories.setValue).toHaveBeenCalledTimes(0);
        expect(component.userProfileForm.controls.email.setValue).toHaveBeenCalledTimes(0);

        component.resetForm(testUser);

        expect(component.userProfileForm.controls.firstName.setValue).toHaveBeenCalledTimes(1);
        expect(component.userProfileForm.controls.lastName.setValue).toHaveBeenCalledTimes(1);
        expect(component.userProfileForm.controls.targetCalories.setValue).toHaveBeenCalledTimes(1);
        expect(component.userProfileForm.controls.email.setValue).toHaveBeenCalledTimes(1);
        expect(component.userProfileForm.controls.firstName.setValue).toHaveBeenCalledWith(testUser.firstName);
        expect(component.userProfileForm.controls.lastName.setValue).toHaveBeenCalledWith(testUser.lastName);
        expect(component.userProfileForm.controls.targetCalories.setValue).toHaveBeenCalledWith(testUser.targetCalories);
        expect(component.userProfileForm.controls.email.setValue).toHaveBeenCalledWith(testUser.email);


    });

    it('Should call next on editUserObservableSubject in save()', () => {

        const testReturnValue = 'test';

        component.ngOnInit();

        component.userProfileForm.controls.firstName.setValue('firstName');
        component.userProfileForm.controls.lastName.setValue('lastName');
        component.userProfileForm.controls.email.setValue('test@test.test');
        component.userProfileForm.controls.targetCalories.setValue(123);

        component.edit();

        const getProfileFormValuesSpy = jasmine.createSpy('getProfileFormValuesSpy').and.callFake((a, b) => testReturnValue);

        spyOnProperty(staticFunctions, 'getProfileFormValues').and.returnValue(getProfileFormValuesSpy);

        expect(component.userProfileForm.status).toBe('VALID');

        spyOn(component.editUserObservableSubject, 'next');

        expect(component.editUserObservableSubject.next).toHaveBeenCalledTimes(0);

        component.save();

        expect(staticFunctions.getProfileFormValues).toHaveBeenCalledWith(component.userProfileForm, component.user);
        expect(component.editUserObservableSubject.next).toHaveBeenCalledTimes(1);
    });


    it('Should call disableFormEditing in save()', () => {


        component.ngOnInit();

        component.userProfileForm.controls.firstName.setValue('firstName');
        component.userProfileForm.controls.lastName.setValue('lastName');
        component.userProfileForm.controls.email.setValue('test@test.test');
        component.userProfileForm.controls.targetCalories.setValue(123);

        component.edit();

        expect(component.userProfileForm.status).toBe('VALID');

        spyOn(component, 'disableFormEditing');

        expect(component.disableFormEditing).toHaveBeenCalledTimes(0);

        component.save();

        expect(component.disableFormEditing).toHaveBeenCalledTimes(1);
    });


    it('Should set editing to false on calling save()', () => {

        component.ngOnInit();

        component.userProfileForm.controls.firstName.setValue('firstName');
        component.userProfileForm.controls.lastName.setValue('lastName');
        component.userProfileForm.controls.email.setValue('test@test.test');
        component.userProfileForm.controls.targetCalories.setValue(123);

        component.edit();

        expect(component.userProfileForm.status).toBe('VALID');

        expect(component.editing).toBeTruthy();

        component.save();

        expect(component.editing).toBeFalsy();
    });

    it('Should set the edit button string to EDIT_STRING on calling save()', () => {

        component.ngOnInit();

        component.userProfileForm.controls.firstName.setValue('firstName');
        component.userProfileForm.controls.lastName.setValue('lastName');
        component.userProfileForm.controls.email.setValue('test@test.test');
        component.userProfileForm.controls.targetCalories.setValue(123);

        component.edit();

        expect(component.userProfileForm.status).toBe('VALID');

        expect(component.buttonMessage).toBe(SAVE_STRING);

        component.save();

        expect(component.buttonMessage).toBe(EDIT_STRING);
    });


    it('Should set the edit button string to EDIT_STRING on calling save()', () => {

        component.ngOnInit();

        component.userProfileForm.controls.firstName.setValue('firstName');
        component.userProfileForm.controls.lastName.setValue('lastName');
        component.userProfileForm.controls.email.setValue('test@test.test');
        component.userProfileForm.controls.targetCalories.setValue(123);

        component.edit();

        expect(component.userProfileForm.status).toBe('VALID');

        expect(component.buttonMessage).toBe(SAVE_STRING);

        component.save();

        expect(component.buttonMessage).toBe(EDIT_STRING);
    });


    it('Should call setMessage in save()', () => {


        component.ngOnInit();

        component.userProfileForm.controls.firstName.setValue('firstName');
        component.userProfileForm.controls.lastName.setValue('lastName');
        component.userProfileForm.controls.email.setValue('test@test.test');
        component.userProfileForm.controls.targetCalories.setValue(123);

        component.edit();

        expect(component.userProfileForm.status).toBe('VALID');

        spyOn(mockTopNotificationService, 'setMessage');

        expect(mockTopNotificationService.setMessage).toHaveBeenCalledTimes(0);

        component.save();

        expect(mockTopNotificationService.setMessage).toHaveBeenCalledTimes(1);
        expect(mockTopNotificationService.setMessage).toHaveBeenCalledWith(PROFILE_UPDATE_SUCCESSFUL);
    });


    it('Should not do anything if the form is invalid save()', () => {

        component.ngOnInit();

        component.userProfileForm.controls.firstName.setValue('');
        component.userProfileForm.controls.lastName.setValue('lastName');
        component.userProfileForm.controls.email.setValue('test@test.test');
        component.userProfileForm.controls.targetCalories.setValue(123);

        component.edit();

        expect(component.userProfileForm.status).toBe('INVALID');

        expect(component.editing).toBeTruthy();

        component.save();

        expect(component.editing).toBeTruthy();
    });

    it('Should call enableFormEditing in edit()', () => {

        component.ngOnInit();

        spyOn(component, 'enableFormEditing');

        expect(component.enableFormEditing).toHaveBeenCalledTimes(0);

        component.edit();

        expect(component.enableFormEditing).toHaveBeenCalledTimes(1);
    });

    it('Should set editing to true edit()', () => {

        component.ngOnInit();

        expect(component.editing).toBeFalsy();

        component.edit();

        expect(component.editing).toBeTruthy();
    });

    it('Should set buttonMessage string to "SAVE_STRING" in edit()', () => {

        component.ngOnInit();

        expect(component.buttonMessage).toBe(EDIT_STRING);

        component.edit();

        expect(component.buttonMessage).toBe(SAVE_STRING);

    });

    it('Should call enableFormEditing in abort()', () => {

        component.ngOnInit();

        spyOn(component, 'disableFormEditing');

        expect(component.disableFormEditing).toHaveBeenCalledTimes(0);

        component.abort();

        expect(component.disableFormEditing).toHaveBeenCalledTimes(1);
    });

    it('Should set editing to false abort()', () => {

        component.ngOnInit();

        component.edit();

        expect(component.editing).toBeTruthy();

        component.abort();

        expect(component.editing).toBeFalsy();
    });

    it('Should set buttonMessage string to "EDIT_STRING" in abort()', () => {

        component.ngOnInit();

        component.edit();

        expect(component.buttonMessage).toBe(SAVE_STRING);

        component.abort();

        expect(component.buttonMessage).toBe(EDIT_STRING);

    });


    it('Should call userService.disconnectRequestObservable with the subscription in ngOnDestroy', () => {

        component.ngOnInit();

        spyOn(mockUserService, 'disconnectRequestObservable');

        expect(mockUserService.disconnectRequestObservable).toHaveBeenCalledTimes(0);

        component.ngOnDestroy();

        expect(mockUserService.disconnectRequestObservable).toHaveBeenCalledTimes(1);
        expect(mockUserService.disconnectRequestObservable).toHaveBeenCalledWith(component.editUserObservableSubscription);
    });

    it('Should unsubscribe from userObservableSubscription in ngOnDestroy', () => {

        component.ngOnInit();

        spyOn(component.userObservableSubscription, 'unsubscribe');

        expect(component.userObservableSubscription.unsubscribe).toHaveBeenCalledTimes(0);

        component.ngOnDestroy();

        expect(component.userObservableSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('Should unsubscribe from mealsObservableSubscription in ngOnDestroy', () => {

        component.ngOnInit();

        spyOn(component.mealsObservableSubscription, 'unsubscribe');

        expect(component.mealsObservableSubscription.unsubscribe).toHaveBeenCalledTimes(0);

        component.ngOnDestroy();

        expect(component.mealsObservableSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });

});
