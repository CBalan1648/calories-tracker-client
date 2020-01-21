import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { from, Observable } from 'rxjs';
import { groupBy, map, mergeMap, reduce } from 'rxjs/operators';
import { Meal } from '../models/meal';
import { User } from '../models/user';
import { MealsStats } from './interfaces';

export const getMealFormValues = (form) => {
    const formValues = form.controls;
    return {
        title: formValues.title.value,
        description: formValues.description.value,
        time: formValues.time.value ? Date.parse(formValues.time.value) : Date.now(),
        calories: formValues.calories.value,
    };
};

export const resetMealForm = (form) => {
    form.reset();
    form.controls.calories.setErrors(null);
    form.controls.title.setErrors(null);
    form.status = 'INVALID';
};

export const getRegisterFormFormValues = (form) => {
    const formValues = form.controls;
    return {
        firstName: formValues.firstName.value,
        lastName: formValues.lastName.value,
        email: formValues.email.value,
        password: formValues.password.value
    };
};

export const getRegisterFormFormValuesAdmin = (form) => {
    const formValues = form.controls;
    return {
        firstName: formValues.firstName.value,
        lastName: formValues.lastName.value,
        email: formValues.email.value,
        password: formValues.password.value,
        authLevel: formValues.authLevel.value,
    };
};

export const isAdmin = (user) => user && user.authLevel === 'ADMIN';

export const getEditMealFormValues = (form, meal) => {
    const formValues = form.controls;
    return {
        _id: meal._id,
        title: formValues.title.value,
        description: formValues.description.value,
        calories: formValues.calories.value,
        time: Date.parse(formValues.time.value) || meal.time,
    };
};

export const getEditUserFormValues = (form, userData) => {
    const formValues = form.controls;
    return {
        _id: userData._id,
        authLevel: formValues.authLevel.value,
        token: userData.token,
        firstName: formValues.firstName.value,
        lastName: formValues.lastName.value,
        email: formValues.email.value,
        targetCalories: formValues.targetCalories.value,
    };
};

export const getProfileFormValues = (form, userData) => {
    const formValues = form.controls;
    return {
        _id: userData._id,
        authLevel: userData.authLevel,
        token: userData.token,
        firstName: formValues.firstName.value,
        lastName: formValues.lastName.value,
        email: formValues.email.value,
        targetCalories: formValues.targetCalories.value,
    };
};


export const getLoginFormValues = (form) => {
    const formValues = form.controls;
    return {
        email: formValues.email.value,
        password: formValues.password.value
    };
};

export const getTokenData = (token: string): [User | null, boolean] => {
    try {
        const tokenInfoJson = atob(token.split('.')[1]);
        const tokenInfo = JSON.parse(tokenInfoJson);
        return [tokenInfo.user, true];
    } catch (e) {
        return [null, false];
    }
};

export const saveToken = (token) => {
    localStorage.setItem('token', token);
};

export const deleteToken = () => {
    localStorage.removeItem('token');
};


export const samePasswordValidator: ValidatorFn = (form: FormGroup): ValidationErrors | null => {
    const password = form.get('password');
    const repeatedPassword = form.get('repeatPassword');

    return password.value !== repeatedPassword.value ? { passwordRepeatError: true } : null;
};

export const mealStatsReducer = (targetCalories, statsCounter, currentValue) => {
    if (currentValue.calories > statsCounter.mostCaloricMealCalories) {
        statsCounter.mostCaloricMealCalories = currentValue.calories;
        statsCounter.mostCaloricMealTitle = currentValue.title;
    }

    if (currentValue.calories < statsCounter.leastCaloricMealCalories) {
        statsCounter.leastCaloricMealCalories = currentValue.calories;
        statsCounter.leastCaloricMealTitle = currentValue.title;
    }

    currentValue.calories >= targetCalories ? statsCounter.mealsAboveTarget++ : statsCounter.mealsBelowTarget++;
    statsCounter.totalCalories += currentValue.calories;
    return statsCounter;
};

export const generateMealStats = (meals: Meal[], initialMealStats: MealsStats, targetCalories: number) => {
    let calculatedStats = { ...initialMealStats };

    calculatedStats = meals.reduce(mealStatsReducer.bind(null, targetCalories), calculatedStats);
    calculatedStats.totalMeals = meals.length;
    calculatedStats.averageCalories = Number(calculatedStats.totalCalories / calculatedStats.totalMeals).toFixed(2);

    return calculatedStats;
};

export const updateUserInArray = (userData, currentUserArray) => {
    const updatedUserIndex = currentUserArray.findIndex(arrayElement => arrayElement._id === userData._id);
    const updatedArray = [...currentUserArray];
    updatedArray.splice(updatedUserIndex, 1, userData);

    return updatedArray;
};

export const filterUsers = ([usersArray, filterData]) => {
    if (!filterData) { return usersArray; }

    return usersArray.filter((user: User) => {
        return (filterData.searchString ? containString(user.firstName, user.lastName, user.email, filterData.searchString) : true) &&
            (filterData.searchAuthLevel ? filterLevel(user.authLevel, filterData.searchAuthLevel) : true);
    });
};

export const containString = (testFirstName, testLastName, testEmail, searchString) => {

    const lowerCaseSearch = searchString.toLowerCase();

    return testFirstName.toLowerCase().includes(lowerCaseSearch) ||
        testLastName.toLowerCase().includes(lowerCaseSearch) ||
        testEmail.toLowerCase().includes(lowerCaseSearch);
};

export const filterLevel = (userAuthLevel, searchAuthLevel) => userAuthLevel === searchAuthLevel;

export const isInTimeSpan = (targetDate, [fromDate, toDate]) => targetDate >= fromDate && targetDate <= toDate;

export const isInTimeFrame = (targetTime, [frameBegin, frameEnd]) => {
    const date = new Date(targetTime);
    const targetHour = date.getHours();
    const targetMinute = date.getMinutes();

    const [frameBeginHour, frameBeginMinute] = frameBegin.split(':').map(Number);
    const [frameEndHour, frameEndMinute] = frameEnd.split(':').map(Number);

    return (targetHour > frameBeginHour ||
        targetHour === frameBeginHour && targetMinute > frameBeginMinute) &&
        (targetHour < frameEndHour ||
            targetHour === frameEndHour && targetMinute < frameEndMinute);

};

export const updateMealWithCalories = ([filteredMealsObservable, userObservable]) => {
    const tagetCalories = userObservable.targetCalories;

    return from([filteredMealsObservable]).pipe(
        mergeMap((mealArray: Meal[]) => from(mealArray).pipe(
            groupBy((meal: Meal) => {
                const mealDate = new Date(meal.time);
                const mealDay = `${mealDate.getUTCDate()}-${mealDate.getUTCMonth() + 1}-${mealDate.getUTCFullYear()}`;
                meal.day = mealDay;
                return mealDay;
            }),
            mergeMap((groupedMealsObservable: Observable<any>) => groupedMealsObservable.pipe(
                reduce((acc, cur) => [...acc, cur], []),
            )),
            map(groupedMeals => {
                const totCal = groupedMeals.reduce((totCalories, meal) => totCalories += meal.calories, 0);
                return groupedMeals.map(meal => ({ ...meal, overCal: totCal > tagetCalories }));
            }),
            reduce((acc, cur) => [...acc, ...cur], []),
        ))
    );
};

export const getTimeSpan = (timeSpan, customDateFrom, customDateTo) => {
    const timeSpanOptions = {
        SPAN_LAST_24_HOURS: [Date.now() - 86400000, Date.now()],
        SPAN_LAST_7_DAYS: [Date.now() - 86400000 * 7, Date.now()],
        SPAN_LAST_30_DAYS: [Date.now() - 86400000 * 30, Date.now()],
        SPAN_CUSTOM: [Date.parse(customDateFrom) || 0, Date.parse(customDateTo) || Date.now()]
    };
    return timeSpanOptions[timeSpan];
};

export const getTimeFrame = (timeFrame: string, frameBegin: string, frameEnd: string) => {
    const timeSpanOptions = {
        FRAME_BREAKFAST: ['07:00', '09:00'],
        FRAME_LUNCH: ['12:00', '14:00'],
        FRAME_DINNER: ['20:00', '22:00'],
        FRAME_CUSTOM: [frameBegin || '00:00', frameEnd || '23:59']
    };
    return timeSpanOptions[timeFrame];
};


export const reduceCaloriesToDays = (meals: Meal[]): Map<string, number> => {
    const daysMap = new Map();

    meals.forEach(meal => {
        const currentValue = daysMap.get(meal.day);
        daysMap.set(meal.day, currentValue ? currentValue + meal.calories : meal.calories);
    });

    return daysMap;
};

