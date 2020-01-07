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

export const getEditMealFormValues = (form, data) => {
    const formValues = form.controls;
    return {
        _id: data.meal._id,
        title: formValues.title.value,
        description: formValues.description.value,
        calories: formValues.calories.value,
        time: Date.parse(formValues.time.value) || this.data.meal.time,
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

