import { Validators } from '@angular/forms';

export const mealFormConfig = {
    title: ['', Validators.required],
    description: [''],
    time: [''],
    calories: ['', Validators.required]
};

export const registerFormConfig = {
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
};
