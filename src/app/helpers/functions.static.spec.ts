import { FormGroup } from '@angular/forms';
import { Meal } from '../models/meal';
import { User } from '../models/user';
import {
    getEditMealFormValues,
    getEditUserFormValues,
    getLoginFormValues,
    getMealFormValues,
    getProfileFormValues,
    getRegisterFormFormValues,
    getRegisterFormFormValuesAdmin,
    isAdmin,
    resetMealForm,
    saveToken,
    deleteToken
} from './functions.static';



describe('Static functions', () => {

    describe('getMealFormValues', () => {

        const mockFormWithTime = {
            controls: {
                title: {
                    value: 'title'
                },
                description: {
                    value: 'description'
                },
                time: {
                    value: ' 04 Dec 1995 00:12:00 GMT'
                },
                calories: {
                    value: 123
                }
            }
        } as unknown as FormGroup;

        it('Should return the form values', () => {
            const returnValue = getMealFormValues(mockFormWithTime);

            expect(returnValue.title).toEqual(mockFormWithTime.controls.title.value);
            expect(returnValue.description).toEqual(mockFormWithTime.controls.description.value);
            expect(returnValue.time).toEqual(Date.parse(mockFormWithTime.controls.time.value));
            expect(returnValue.calories).toEqual(mockFormWithTime.controls.calories.value);

        });

        const mockFormWithoutTime = {
            controls: {
                title: {
                    value: 'title'
                },
                description: {
                    value: 'description'
                },
                time: {
                    value: void 0
                },
                calories: {
                    value: 123
                }
            }
        } as unknown as FormGroup;

        it('Should return the form values and the current time', () => {
            const returnValue = getMealFormValues(mockFormWithoutTime);

            expect(returnValue.title).toEqual(mockFormWithTime.controls.title.value);
            expect(returnValue.description).toEqual(mockFormWithTime.controls.description.value);
            expect(Math.round(returnValue.time / 10000)).toEqual(Math.round(Date.now() / 10000));
            expect(returnValue.calories).toEqual(mockFormWithTime.controls.calories.value);

        });
    });

    describe('resetMealForm', () => {

        const mockForm = {
            reset: () => { },
            status: 'VALID',
            controls: {
                title: {
                    setErrors: () => { }
                },

                calories: {
                    setErrors: () => { }
                }
            }
        } as unknown as FormGroup;

        it('Should reset the form', () => {
            spyOn(mockForm, 'reset');
            spyOn(mockForm.controls.title, 'setErrors');
            spyOn(mockForm.controls.calories, 'setErrors');
            // expect(mockForm.status !== 'INVALID').toBeTruthy();

            resetMealForm(mockForm);

            expect(mockForm.reset).toHaveBeenCalledTimes(1);
            expect(mockForm.controls.title.setErrors).toHaveBeenCalledTimes(1);
            expect(mockForm.controls.calories.setErrors).toHaveBeenCalledTimes(1);
            // expect(mockForm.status === 'INVALID').toBeTruthy();
        });
    });

    describe('getRegisterFormFormValues', () => {

        const mockFormWithTime = {
            controls: {
                firstName: {
                    value: 'firstName'
                },
                lastName: {
                    value: 'lastName'
                },
                email: {
                    value: 'email'
                },
                password: {
                    value: 'password'
                }
            }
        } as unknown as FormGroup;

        it('Should return the form values', () => {
            const returnValue = getRegisterFormFormValues(mockFormWithTime);

            expect(returnValue.firstName).toEqual(mockFormWithTime.controls.firstName.value);
            expect(returnValue.lastName).toEqual(mockFormWithTime.controls.lastName.value);
            expect(returnValue.email).toEqual(mockFormWithTime.controls.email.value);
            expect(returnValue.password).toEqual(mockFormWithTime.controls.password.value);

        });

    });

    describe('getRegisterFormFormValuesAdmin', () => {

        const mockForm = {
            controls: {
                firstName: {
                    value: 'firstName'
                },
                lastName: {
                    value: 'lastName'
                },
                email: {
                    value: 'email'
                },
                password: {
                    value: 'password'
                },
                authLevel: {
                    value: 'authLevel'
                }
            }
        } as unknown as FormGroup;

        it('Should return the form values', () => {
            const returnValue = getRegisterFormFormValuesAdmin(mockForm);

            expect(returnValue.firstName).toEqual(mockForm.controls.firstName.value);
            expect(returnValue.lastName).toEqual(mockForm.controls.lastName.value);
            expect(returnValue.email).toEqual(mockForm.controls.email.value);
            expect(returnValue.password).toEqual(mockForm.controls.password.value);
            expect(returnValue.authLevel).toEqual(mockForm.controls.authLevel.value);

        });

    });

    describe('isAdmin', () => {

        const normalUser = { authLevel: 'USER' } as User;
        const adminUser = { authLevel: 'ADMIN' } as User;

        it('Should if the user is an admin', () => {
            expect(isAdmin(void 0)).toBeFalsy();
            expect(isAdmin(normalUser)).toBeFalsy();
            expect(isAdmin(adminUser)).toBeTruthy();
        });

    });

    describe('getEditMealFormValues', () => {

        const mockFormWithTime = {
            controls: {
                title: {
                    value: 'title'
                },
                description: {
                    value: 'description'
                },
                time: {
                    value: ' 04 Dec 1995 00:12:00 GMT'
                },
                calories: {
                    value: 123
                }
            }
        } as unknown as FormGroup;

        const mockMeal = { _id: '123', time: 123123123 } as Meal;

        it('Should return the form values', () => {
            const returnValue = getEditMealFormValues(mockFormWithTime, mockMeal);

            expect(returnValue._id).toEqual(mockMeal._id);
            expect(returnValue.title).toEqual(mockFormWithTime.controls.title.value);
            expect(returnValue.description).toEqual(mockFormWithTime.controls.description.value);
            expect(returnValue.time).toEqual(Date.parse(mockFormWithTime.controls.time.value));
            expect(returnValue.calories).toEqual(mockFormWithTime.controls.calories.value);

        });

        const mockFormWithoutTime = {
            controls: {
                title: {
                    value: 'title'
                },
                description: {
                    value: 'description'
                },
                time: {
                    value: void 0
                },
                calories: {
                    value: 123
                }
            }
        } as unknown as FormGroup;

        it('Should return the form values and the old meal time', () => {
            const returnValue = getEditMealFormValues(mockFormWithoutTime, mockMeal);

            expect(returnValue._id).toEqual(mockMeal._id);
            expect(returnValue.title).toEqual(mockFormWithTime.controls.title.value);
            expect(returnValue.description).toEqual(mockFormWithTime.controls.description.value);
            expect(returnValue.time).toEqual(mockMeal.time);
            expect(returnValue.calories).toEqual(mockFormWithTime.controls.calories.value);
        });
    });

    describe('getEditUserFormValues', () => {

        const mockForm = {
            controls: {
                firstName: {
                    value: 'firstName'
                },
                lastName: {
                    value: 'lastName'
                },
                email: {
                    value: 'email'
                },
                targetCalories: {
                    value: 'targetCalories'
                },
                authLevel: {
                    value: 'authLevel'
                }
            }
        } as unknown as FormGroup;

        const mockUserData = { _id: '123', token: 'aaa111aaa222aaa333' } as User;

        it('Should return the form values', () => {
            const returnValue = getEditUserFormValues(mockForm, mockUserData);

            expect(returnValue.firstName).toEqual(mockForm.controls.firstName.value);
            expect(returnValue.lastName).toEqual(mockForm.controls.lastName.value);
            expect(returnValue.email).toEqual(mockForm.controls.email.value);
            expect(returnValue.targetCalories).toEqual(mockForm.controls.targetCalories.value);
            expect(returnValue.authLevel).toEqual(mockForm.controls.authLevel.value);
            expect(returnValue._id).toEqual(mockUserData._id);
            expect(returnValue.token).toEqual(mockUserData.token);
        });
    });

    describe('getProfileFormValues', () => {

        const mockForm = {
            controls: {
                firstName: {
                    value: 'firstName'
                },
                lastName: {
                    value: 'lastName'
                },
                email: {
                    value: 'email'
                },
                targetCalories: {
                    value: 'targetCalories'
                },
                authLevel: {
                    value: 'authLevel'
                }
            }
        } as unknown as FormGroup;

        const mockUserData = { _id: '123', token: 'aaa111aaa222aaa333', authLevel: 'USER' } as User;

        it('Should return the form values', () => {
            const returnValue = getProfileFormValues(mockForm, mockUserData);

            expect(returnValue.firstName).toEqual(mockForm.controls.firstName.value);
            expect(returnValue.lastName).toEqual(mockForm.controls.lastName.value);
            expect(returnValue.email).toEqual(mockForm.controls.email.value);
            expect(returnValue.targetCalories).toEqual(mockForm.controls.targetCalories.value);
            expect(returnValue.authLevel).toEqual(mockUserData.authLevel);
            expect(returnValue._id).toEqual(mockUserData._id);
            expect(returnValue.token).toEqual(mockUserData.token);
        });
    });

    describe('getLoginFormValues', () => {

        const mockForm = {
            controls: {
                email: {
                    value: 'email'
                },
                password: {
                    value: 'password'
                },
            }
        } as unknown as FormGroup;

        it('Should return the form values', () => {
            const returnValue = getLoginFormValues(mockForm);

            expect(returnValue.email).toEqual(mockForm.controls.email.value);
            expect(returnValue.password).toEqual(mockForm.controls.password.value);
        });
    });

    describe('saveToken', () => {

        const token = 'aaa111aaa222';

        it('Save the token to localstorage', () => {

            spyOn(localStorage, 'setItem');

            saveToken(token);

            expect(localStorage.setItem).toHaveBeenCalledTimes(1);
            expect(localStorage.setItem).toHaveBeenCalledWith('token', token);
        });
    });

    describe('deleteToken', () => {

        it('Remove the token from localstorage', () => {

            spyOn(localStorage, 'removeItem');

            deleteToken();

            expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
            expect(localStorage.removeItem).toHaveBeenCalledWith('token');
        });
    });
});
