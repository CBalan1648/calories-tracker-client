import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { WeekDayPipe } from 'src/app/helpers/week-day.pipe';
import { Meal } from 'src/app/models/meal';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import { MealsService } from 'src/app/services/meals.service';
import { UserService } from 'src/app/services/user.service';
import { AdminComponent, RefactorDataSource } from './admin.component';

const testMeal: Meal = { _id: 'aaa111aaa22', title: 'mealTitle', time: 123012312, calories: 123, description: '', overCal: true };

const testUser: User = {
    _id: '123123123',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'test@test.test',
    targetCalories: 123,
    authLevel: 'USER'
};

const testAdmin: User = {
    _id: '123123123',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'test@test.test',
    targetCalories: 123,
    authLevel: 'ADMIN'
};

const testMealsArray: Meal[] = [testMeal];

describe('AdminComponent Template', () => {
    let component: AdminComponent;
    let fixture: ComponentFixture<AdminComponent>;

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
                MatExpansionModule,
            ],
            declarations: [AdminComponent, WeekDayPipe],
            providers: [
                {
                    provide: Router,
                    useClass: class { navigate = jasmine.createSpy('navigate'); }
                },
                {
                    provide: MealsService,
                    useClass: class {
                        getRawObservable = () => {
                            return new BehaviorSubject<Meal[]>(testMealsArray);
                        }
                        deleteMealRequest = () => { };
                        getMeals = () => { };
                    }
                },
                {
                    provide: AdminService,
                    useClass: class {
                        getUserObservable = () => {
                            return new BehaviorSubject<User[]>([testUser]);
                        }
                        deleteUserRequest = () => { };
                        getUsers = () => { };
                    }
                },
                {
                    provide: UserService,
                    useClass: class {
                        getUserObservable = () => {
                            return new BehaviorSubject<User>(testAdmin);
                        }
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
        fixture = TestBed.createComponent(AdminComponent);
        component = fixture.componentInstance;
    });

    it('Should create AdminComponent', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('Should render user data in the expansion panel header', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        const expansionPanelHeader = fixture.debugElement.query(By.css('.admin-extension-panel')).nativeElement;

        const expansionPanelText = expansionPanelHeader.innerText.trim();

        expect(expansionPanelHeader).toBeTruthy();

        expect(expansionPanelText.includes(testUser.firstName)).toBeTruthy();
        expect(expansionPanelText.includes(testUser.lastName)).toBeTruthy();
        expect(expansionPanelText.includes(testUser.email)).toBeTruthy();
        expect(expansionPanelText.includes(testUser.authLevel)).toBeTruthy();
    }));


    it('Should call loadData when opening the expansion panel', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        spyOn(component, 'loadData');

        const expansionPanelHeader = fixture.debugElement.query(By.css('mat-expansion-panel')).componentInstance;

        expect(component.loadData).toHaveBeenCalledTimes(0);


        expansionPanelHeader.open();

        expect(component.loadData).toHaveBeenCalledTimes(1);
        expect(component.loadData).toHaveBeenCalledWith(testUser._id);
    }));


    it('Should call loadData when opening the expansion panel', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        spyOn(component, 'isAdmin');

        const expansionPanelHeader = fixture.debugElement.query(By.css('mat-expansion-panel')).componentInstance;

        expect(component.isAdmin).toHaveBeenCalledTimes(0);

        expansionPanelHeader.open();

        fixture.detectChanges();

        expect(component.isAdmin).toHaveBeenCalledWith(testAdmin);
    }));

    it('Should call openEditUserDialog when clicking the edit button', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        spyOn(component, 'openEditUserDialog');

        const expansionPanelHeader = fixture.debugElement.query(By.css('mat-expansion-panel')).componentInstance.open();

        fixture.detectChanges();

        expect(component.openEditUserDialog).toHaveBeenCalledTimes(0);

        const editButton = fixture.debugElement.query(By.css('.edit')).nativeElement;

        expect(editButton).toBeTruthy();

        editButton.click();

        expect(component.openEditUserDialog).toHaveBeenCalledTimes(1);
        expect(component.openEditUserDialog).toHaveBeenCalledWith(testUser);
    }));

    it('Should call deleteUser when clicking the delete button', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        spyOn(component, 'deleteUser');

        const expansionPanelHeader = fixture.debugElement.query(By.css('mat-expansion-panel')).componentInstance.open();

        fixture.detectChanges();

        expect(component.deleteUser).toHaveBeenCalledTimes(0);

        const deleteButton = fixture.debugElement.query(By.css('.delete')).nativeElement;

        expect(deleteButton).toBeTruthy();

        deleteButton.click();

        expect(component.deleteUser).toHaveBeenCalledTimes(1);
        expect(component.deleteUser).toHaveBeenCalledWith(testUser._id);
    }));


    it('Should call openMealAddDialog when clicking the new button', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        spyOn(component, 'openMealAddDialog');

        const expansionPanelHeader = fixture.debugElement.query(By.css('mat-expansion-panel')).componentInstance.open();

        fixture.detectChanges();

        expect(component.openMealAddDialog).toHaveBeenCalledTimes(0);

        const newButton = fixture.debugElement.query(By.css('.new')).nativeElement;

        expect(newButton).toBeTruthy();

        newButton.click();

        expect(component.openMealAddDialog).toHaveBeenCalledTimes(1);
        expect(component.openMealAddDialog).toHaveBeenCalledWith(testUser._id);
    }));

    it('Should call openMealAddDialog when clicking the new button', fakeAsync(() => {
        fixture.detectChanges();
        tick(100);
        fixture.detectChanges();

        spyOn(component, 'getData').and.callThrough();

        const expansionPanelHeader = fixture.debugElement.query(By.css('mat-expansion-panel')).componentInstance.open();

        fixture.detectChanges();

        const newButton = fixture.debugElement.query(By.css('.title'));
        console.log(newButton)

        // expect(newButton).toBeTruthy();

        expect(component.getData).toHaveBeenCalledWith(testUser._id);
    }));

});


// const testUser = { _id: '123' } as User;

// class MockMealsService {
//     subject = new BehaviorSubject<Meal[]>(testMealsArray);
//     getFilteredMealObservable = () => {
//         return this.subject;
//     }

//     deleteMealRequest = () => { };
//     getMeals = () => { };
// }

// class MockDialog {
//     open = () => { };
// }


// class MockUserService {
//     subject = new BehaviorSubject<User>(testUser);
//     getUserObservable = () => {
//         return this.subject;
//     }
// }


// describe('AdminComponent', () => {
//     let component: AdminComponent;
//     let mockMealsService: MealsService;
//     let mockUserService: UserService;
//     const mockDialog: MatDialog = new MockDialog() as unknown as MatDialog;

//     beforeEach(() => {
//         mockMealsService = new MockMealsService() as unknown as MealsService;
//         mockUserService = new MockUserService() as unknown as UserService;
//         component = new AdminComponent(mockMealsService, mockDialog, mockUserService);
//     });

//     it('Should call mealService.getMeals on ngOnInit', () => {
//         spyOn(mockMealsService, 'getMeals');

//         expect(mockMealsService.getMeals).toHaveBeenCalledTimes(0);

//         component.ngOnInit();

//         expect(mockMealsService.getMeals).toHaveBeenCalledTimes(1);
//     });

// });
