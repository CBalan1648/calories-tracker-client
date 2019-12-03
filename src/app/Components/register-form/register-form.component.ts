import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject, Subscription } from 'rxjs';
import { RegisterService } from 'src/app/Services/register.service';
import { TopNotificationService } from '../../Services/top-notification.service';
import { registerFormConfig } from 'src/app/Helpers/objects.static';
import { getRegisterFormFormValues } from 'src/app/Helpers/functions.static';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnDestroy, OnInit {

  private observableSubject: Subject<any> = new Subject();
  private observableSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private registerService: RegisterService,
              private topNotification: TopNotificationService) { }

  registerForm = this.formBuilder.group(registerFormConfig, { validators: samePasswordValidator });

  errorStateMatcher = new RepeatPasswordFormErrorMatcher();

  ngOnInit() {
    this.observableSubscription = this.registerService.connectRequestObservable(this.observableSubject);
  }

  ngOnDestroy() {
    this.registerService.disconnectRequestObservable(this.observableSubscription);
  }

  submitForm() {
    if (this.registerForm.status === 'VALID') {
      this.observableSubject.next([getRegisterFormFormValues(this.registerForm), true]);
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
