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

export const isAdmin = (user) => {

console.log("IS ADMIN",user)
    return user && user.authLevel === 'ADMIN';
};
