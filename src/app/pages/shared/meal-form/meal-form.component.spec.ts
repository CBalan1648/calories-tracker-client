import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import * as staticFunctions from 'src/app/helpers/functions.static';
import * as staticObjects from 'src/app/helpers/objects.static';
import { MealFormComponent } from './meal-form.component';

const MISSING_TITLE_FORM_VALUES = {
    title: void 0,
    description: 'description-string',
    time: 1123123123123,
    calories: 120,
};

const MISSING_DESCRIPTION_FORM_VALUES = {
    title: 'title-string',
    description: void 0,
    time: 1123123123123,
    calories: 120,
};

const MISSING_TIME_FORM_VALUES = {
    title: 'title-string',
    description: 'description-string',
    time: void 0,
    calories: 120,
};

const MISSING_CALORIES_FORM_VALUES = {
    title: 'title-string',
    description: 'description-string',
    time: 1123123123123,
    calories: void 0,
};

const VALID_FORM_VALUES = {
    title: 'title-string',
    description: 'description-string',
    time: 1123123123123,
    calories: 120,
};


const setMealFormControls = (mealForm, targetObject) => {
    mealForm.controls.title.setValue(targetObject.title);
    mealForm.controls.description.setValue(targetObject.description);
    mealForm.controls.time.setValue(targetObject.time);
    mealForm.controls.calories.setValue(targetObject.calories);
};


describe('MealFormComponent Template', () => {
    let component: MealFormComponent;
    let fixture: ComponentFixture<MealFormComponent>;


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
            declarations: [MealFormComponent],
            providers: [{
                provide: Router,
                useClass: class { navigate = jasmine.createSpy('navigate'); }
            },
            ]
        })
            .compileComponents();


    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MealFormComponent);
        component = fixture.componentInstance;
        component.hideBackground = true;
        component.onSubmit = () => void 0;
        component.meal = undefined;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('MealForm should be invalid because missing title', () => {
        fixture.detectChanges();

        setMealFormControls(component.mealForm, MISSING_TITLE_FORM_VALUES);

        expect(component.mealForm.controls.title.errors).toBeTruthy();
        expect(component.mealForm.controls.description.errors).toBeFalsy();
        expect(component.mealForm.controls.time.errors).toBeFalsy();
        expect(component.mealForm.controls.calories.errors).toBeFalsy();
        expect(component.mealForm.valid).toBeFalsy();
    });

    it('MealForm should be valid because desciption is optional', () => {
        fixture.detectChanges();

        setMealFormControls(component.mealForm, MISSING_DESCRIPTION_FORM_VALUES);

        expect(component.mealForm.controls.title.errors).toBeFalsy();
        expect(component.mealForm.controls.description.errors).toBeFalsy();
        expect(component.mealForm.controls.time.errors).toBeFalsy();
        expect(component.mealForm.controls.calories.errors).toBeFalsy();
        expect(component.mealForm.valid).toBeTruthy();
    });


    it('MealForm should be valid because time is optional', () => {
        fixture.detectChanges();
        setMealFormControls(component.mealForm, MISSING_TIME_FORM_VALUES);

        expect(component.mealForm.controls.title.errors).toBeFalsy();
        expect(component.mealForm.controls.description.errors).toBeFalsy();
        expect(component.mealForm.controls.time.errors).toBeFalsy();
        expect(component.mealForm.controls.calories.errors).toBeFalsy();
        expect(component.mealForm.valid).toBeTruthy();
    });

    it('MealForm should be invalid because calories is missing', () => {
        fixture.detectChanges();

        setMealFormControls(component.mealForm, MISSING_CALORIES_FORM_VALUES);

        expect(component.mealForm.controls.title.errors).toBeFalsy();
        expect(component.mealForm.controls.description.errors).toBeFalsy();
        expect(component.mealForm.controls.time.errors).toBeFalsy();
        expect(component.mealForm.controls.calories.errors).toBeTruthy();
        expect(component.mealForm.valid).toBeFalsy();
    });


    it('MealForm should call on onSubmit because the form is valid', () => {
        fixture.detectChanges();
        spyOn(component, 'onSubmit');

        setMealFormControls(component.mealForm, VALID_FORM_VALUES);

        const submitButton = fixture.debugElement.query(By.css('button')).nativeElement;

        expect(component.mealForm.valid).toBeTruthy();

        fixture.detectChanges();

        submitButton.click();

        expect(component.onSubmit).toHaveBeenCalledTimes(1);
    });

    it('MealForm should not call on onSubmit because the form is invalid', () => {
        fixture.detectChanges();
        spyOn(component, 'onSubmit');

        setMealFormControls(component.mealForm, MISSING_CALORIES_FORM_VALUES);

        const submitButton = fixture.debugElement.query(By.css('button')).nativeElement;

        expect(component.mealForm.valid).toBeFalsy();

        fixture.detectChanges();

        submitButton.click();

        expect(component.onSubmit).toHaveBeenCalledTimes(0);
    });

    it('Component container should have the "background" class because the hideBackground @input is false', () => {

        component.hideBackground = false;

        fixture.detectChanges();

        const componentContainerClasses = fixture.debugElement.query(By.css('.meal-form-container')).nativeElement.classList;

        expect([...componentContainerClasses].includes('background')).toBeTruthy();
    });


    it('Component container should not have the "background" class because the hideBackground @input is true', () => {

        component.hideBackground = true;

        fixture.detectChanges();

        const componentContainerClasses = fixture.debugElement.query(By.css('.meal-form-container')).nativeElement.classList;

        expect([...componentContainerClasses].includes('background')).toBeFalsy();
    });

    it('Component container should not have the "background" class because the hideBackground @input is true', () => {

        component.hideBackground = true;

        fixture.detectChanges();

        const componentContainerClasses = fixture.debugElement.query(By.css('.meal-form-container')).nativeElement.classList;

        expect([...componentContainerClasses].includes('background')).toBeFalsy();
    });

    it('Component h2 title should be "Edit Meal" because the meal @input is truthy', () => {

        component.meal = {
            title: 'string',
            description: '',
            time: 123,
            calories: 123,
        };

        fixture.detectChanges();

        const componentTitle = fixture.debugElement.query(By.css('h2')).nativeElement.innerHTML;

        expect(componentTitle).toEqual('Edit Meal');
    });

    it('Component h2 title should be "Add new" because the meal @input is falsy', () => {

        component.meal = undefined;

        fixture.detectChanges();

        const componentTitle = fixture.debugElement.query(By.css('h2')).nativeElement.innerHTML;

        expect(componentTitle).toEqual('Add new');
    });

});

class MockFormBuilder {
    public receivedValue: any;
    group = (value) => {
        this.receivedValue = value;
        return new FormBuilder().group(value);
    }
}

describe('MealFormComponent', () => {
    let component: MealFormComponent;
    const mockFormBuilder: FormBuilder = new FormBuilder();

    beforeEach(() => {
        component = new MealFormComponent(mockFormBuilder);
    });

    it('Should call editMealFormConfig with the meal @input value', () => {

        const meal = {
            title: 'string',
            description: '',
            time: 123,
            calories: 123,
        };

        component.hideBackground = true;
        component.onSubmit = () => void 0;
        component.meal = meal;

        const editMealFormConfigSpy = jasmine.createSpy('editMealFormConfigSpy');
        spyOn(component.formBuilder, 'group');
        spyOnProperty(staticObjects, 'editMealFormConfig').and.returnValue(editMealFormConfigSpy);


        component.ngOnInit();

        expect(editMealFormConfigSpy).toHaveBeenCalledWith(meal);
    });

    it('Should call formBuilder.group with the return value of editMealFormConfig', () => {

        const meal = {
            title: 'string',
            description: '',
            time: 123,
            calories: 123,
        };

        component.hideBackground = true;
        component.onSubmit = () => void 0;
        component.meal = meal;

        spyOn(component.formBuilder, 'group');

        expect(component.formBuilder.group).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(component.formBuilder.group).toHaveBeenCalledWith(staticObjects.editMealFormConfig(meal));
    });

    it('Should call formBuilder.group with mealFormConfig', () => {

        component.hideBackground = true;
        component.onSubmit = () => void 0;
        component.meal = void 0;

        spyOn(component.formBuilder, 'group');

        expect(component.formBuilder.group).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(component.formBuilder.group).toHaveBeenCalledWith(staticObjects.mealFormConfig);
    });

    it('Should not call onSubmit because the form is not valid', () => {

        component.hideBackground = true;
        component.onSubmit = () => void 0;
        component.meal = void 0;


        spyOn(component, 'onSubmit');
        spyOn(component, 'submitForm').and.callThrough();

        component.ngOnInit();

        setMealFormControls(component.mealForm, MISSING_CALORIES_FORM_VALUES);

        expect(component.mealForm.valid).toBeFalsy();

        component.submitForm();

        expect(component.submitForm).toHaveBeenCalledTimes(1);
        expect(component.onSubmit).toHaveBeenCalledTimes(0);
    });

    it('Should call getEditMealFormValues with the mealForm and the meal @input value ', () => {

        const meal = {
            title: 'string',
            description: '',
            time: 123,
            calories: 123,
        };
        component.hideBackground = true;
        component.onSubmit = () => void 0;
        component.meal = meal;

        const getEditMealFormValuesSpy = jasmine.createSpy('getEditMealFormValues');
        spyOnProperty(staticFunctions, 'getEditMealFormValues').and.returnValue(getEditMealFormValuesSpy);

        component.ngOnInit();

        setMealFormControls(component.mealForm, VALID_FORM_VALUES);

        expect(component.mealForm.valid).toBeTruthy();

        component.submitForm();

        expect(getEditMealFormValuesSpy).toHaveBeenCalledWith(component.mealForm, meal);
    });

    it('Should call getMealFormValues with the mealForm and the meal @input value ', () => {

        component.hideBackground = true;
        component.onSubmit = () => void 0;
        component.meal = void 0;

        const getMealFormValuesSpy = jasmine.createSpy('getMealFormValues');
        spyOnProperty(staticFunctions, 'getMealFormValues').and.returnValue(getMealFormValuesSpy);

        component.ngOnInit();

        setMealFormControls(component.mealForm, VALID_FORM_VALUES);

        expect(component.mealForm.valid).toBeTruthy();

        component.submitForm();

        expect(getMealFormValuesSpy).toHaveBeenCalledWith(component.mealForm);
    });

    it('Should call onSubmit with the getMealFormValues return value ', () => {

        component.hideBackground = true;
        component.onSubmit = () => void 0;
        component.meal = void 0;

        spyOn(component, 'onSubmit');

        component.ngOnInit();

        setMealFormControls(component.mealForm, VALID_FORM_VALUES);

        expect(component.mealForm.valid).toBeTruthy();

        // Necessary because the original object is modified in submitForm()
        const copyMealForm = new FormBuilder().group(staticObjects.mealFormConfig);

        setMealFormControls(copyMealForm, VALID_FORM_VALUES);

        component.submitForm();

        expect(component.onSubmit).toHaveBeenCalledWith(staticFunctions.getMealFormValues(copyMealForm));
    });

    it('Should call resetMealForm in submitForm', () => {

        component.hideBackground = true;
        component.onSubmit = () => void 0;
        component.meal = void 0;

        const resetMealFormSpy = jasmine.createSpy('resetMealForm');
        spyOnProperty(staticFunctions, 'resetMealForm').and.returnValue(resetMealFormSpy);

        component.ngOnInit();

        setMealFormControls(component.mealForm, VALID_FORM_VALUES);

        expect(component.mealForm.valid).toBeTruthy();

        component.submitForm();

        expect(resetMealFormSpy).toHaveBeenCalledWith(component.mealForm);
    });
});
