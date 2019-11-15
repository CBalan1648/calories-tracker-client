import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormGroupDirective, ValidatorFn, ValidationErrors, NgForm } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TopNotificationService } from '../../Services/top-notification.service';
import { RegisterService } from 'src/app/Services/register.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnDestroy, OnInit {

  private observableSubject: Subject<any> = new Subject();
  private observableSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private registerService: RegisterService,
              private topNotification: TopNotificationService) { }

  registerForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    repeatPassword: ['', Validators.required]
  }, { validators: samePasswordValidator });

  errorStateMatcher = new RepeatPasswordFormErrorMatcher();

  ngOnInit() {
    this.observableSubscription = this.registerService.connectRequestObservable(this.observableSubject);
  }

  ngOnDestroy() {
    this.registerService.disconnectRequestObservable(this.observableSubscription);
  }


  submitForm() {
    if (this.registerForm.status === 'VALID') {
      const formValues = this.registerForm.controls;

      this.observableSubject.next({
        firstName: formValues.firstName.value,
        lastName: formValues.lastName.value,
        email: formValues.email.value,
        password: formValues.password.value
      });
    }
    this.topNotification.setMessage('Hello, this is a notification form - Register Form');
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
