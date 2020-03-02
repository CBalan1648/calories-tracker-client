import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Meal } from 'src/app/models/meal';
import { MealFormComponent } from 'src/app/pages/shared/meal-form/meal-form.component';
import { MealsService } from 'src/app/services/meals.service';
import { EditMealDialogComponent } from './edit-meal-dialog.component';

const testMeal = { title: 'title', time: 123012312, calories: 123, description: '' };

describe('EditMealDialogComponent Template', () => {
    let component: EditMealDialogComponent;
    let fixture: ComponentFixture<EditMealDialogComponent>;

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
            declarations: [EditMealDialogComponent, MealFormComponent],
            providers: [{
                provide: MatDialogRef,
                useClass: class { close = jasmine.createSpy('close'); }
            },
            {
                provide: MAT_DIALOG_DATA,
                useClass: class { meal = testMeal; ownerId: 'asdasd'; }
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
        fixture = TestBed.createComponent(EditMealDialogComponent);
        component = fixture.componentInstance;
    });

    it('Should create EditMealDialogComponent', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('Should pass the meal to the MealFormComponent', () => {

        fixture.detectChanges();

        const mealForm = fixture.debugElement.query(By.css('app-meal-form')).componentInstance;

        expect(mealForm.meal).toEqual(testMeal);
    });
});

class MockMealsService {
    updateMealRequest = (meal: Meal, userId: string) => {
        return void 0;
    }
}

class MockDialogRef {
    close = () => void 0;
}

describe('EditMealDialogComponent', () => {
    let component: EditMealDialogComponent;
    let mockMealsService: MealsService;
    const mockDialogRef: MatDialogRef<EditMealDialogComponent> =
        new MockDialogRef() as unknown as MatDialogRef<EditMealDialogComponent>;

    const data = { meal: testMeal, ownerId: 'asdasd' };

    beforeEach(() => {
        mockMealsService = new MockMealsService() as unknown as MealsService;
        component = new EditMealDialogComponent(mockMealsService, mockDialogRef, data);
    });

    it('Should call mealService.updateMealRequest() in onSubmitEditedMeal()', () => {

        spyOn(mockMealsService, 'updateMealRequest');

        expect(mockMealsService.updateMealRequest).toHaveBeenCalledTimes(0);

        component.onSubmitEditedMeal(testMeal);

        expect(mockMealsService.updateMealRequest).toHaveBeenCalledTimes(1);
        expect(mockMealsService.updateMealRequest).toHaveBeenCalledWith(testMeal, data.ownerId);
    });

    it('Should call component.onClose() in onSubmitEditedMeal()', () => {
        spyOn(component, 'onClose');

        expect(component.onClose).toHaveBeenCalledTimes(0);

        component.onSubmitEditedMeal(testMeal);

        expect(component.onClose).toHaveBeenCalledTimes(1);
    });

    it('Should call mockDialogRef.close() in onClose()', () => {

        spyOn(mockDialogRef, 'close');

        expect(mockDialogRef.close).toHaveBeenCalledTimes(0);

        component.onClose();

        expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    });
});
