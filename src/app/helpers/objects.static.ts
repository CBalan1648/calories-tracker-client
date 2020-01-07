import { Validators } from '@angular/forms';

export const mealFormConfig = {
    title: ['', Validators.required],
    description: [''],
    time: [''],
    calories: ['', Validators.required]
};

export const addUserFormConfig = {
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(12)]],
    authLevel: [''],
};

export const editMealFormConfig = (meal) => {
    console.log("HELLO",meal)
    const date = new Date(meal.time);
    const offset = date.getTimezoneOffset();
    const additionalTime = -offset * 60000;
    const localTime = meal.time + additionalTime;
    const dateArray = new Date(localTime).toISOString().slice(0, -1).split(':');

    return {
        title: [meal.title, Validators.required],
        description: [meal.description],
        time: [`${dateArray[0]}:${dateArray[1]}`],
        calories: [meal.calories, Validators.required]
    };
};


export const editUserFormConfig = (userData) => ({
    firstName: [userData.firstName, Validators.required],
    lastName: [userData.lastName, Validators.required],
    email: [userData.email],
    targetCalories: [userData.targetCalories, [Validators.required]],
    authLevel: [userData.authLevel, Validators.required],
});

export const filterFormConfig = {
    stringSearch: [''],
    timeSpan: [''],
    customDateFrom: [''],
    customDateTo: [''],
    timeFrame: [''],
    frameBegin: [''],
    frameEnd: [''],
};

export const loginFormConfig = {
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required]
};

export const registerFormConfig = {
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(12)]],
    repeatPassword: ['', Validators.required]
};

export const searchUserFormConfig = (data) => ({
    searchString: [data.searchString],
    searchAuthLevel: [data.searchAuthLevel],
});

export const userProfileFormConfig = {
    firstName: [{ value: '', disabled: true }, Validators.required],
    lastName: [{ value: '', disabled: true }, Validators.required],
    email: [{ value: '', disabled: true }],
    targetCalories: [{ value: '', disabled: true }, [Validators.required]],
};
