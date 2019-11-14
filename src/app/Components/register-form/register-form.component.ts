import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormGroupDirective, ValidatorFn, ValidationErrors, NgForm } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {

  constructor(private formBuilder: FormBuilder) { }

  registerForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    repeatPassword: ['', Validators.required]
  }, { validators: samePasswordValidator });

  errorStateMatcher = new RepeatPasswordFormErrorMatcher();

  submitForm() {
    console.log('Register Form ', { form: this.registerForm });
  }

}

class RepeatPasswordFormErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    const formErrors = form.form.errors && form.form.errors.passwordRepeatError;
    return !!(control && (control.invalid || formErrors) && (control.dirty || control.touched || isSubmitted));
  }
}

const samePasswordValidator: ValidatorFn = (form: FormGroup): ValidationErrors | null => {
  const password = form.get('password');
  const repeatedPassword = form.get('repeatPassword');

  return password.value !== repeatedPassword.value ? { passwordRepeatError: true } : null;
};
