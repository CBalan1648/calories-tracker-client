import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject, Subscription } from 'rxjs';
import { getRegisterFormFormValues, samePasswordValidator } from 'src/app/helpers/functions.static';
import { registerFormConfig } from 'src/app/helpers/objects.static';
import { RegisterService } from 'src/app/services/register.service';
import { TopNotificationService, AUTO_LOGIN_NOTIFICATION } from '../../services/top-notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy, OnInit {

  public observableSubject: Subject<any> = new Subject();
  public observableSubscription: Subscription;
  public registerForm: FormGroup;
  public errorStateMatcher = new RepeatPasswordFormErrorMatcher();

  constructor(private formBuilder: FormBuilder,
              private registerService: RegisterService,
              private topNotification: TopNotificationService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(registerFormConfig, { validators: samePasswordValidator });
    this.observableSubscription = this.registerService.connectRequestObservable(this.observableSubject);
  }

  ngOnDestroy() {
    this.registerService.disconnectRequestObservable(this.observableSubscription);
  }

  submitForm() {
    if (this.registerForm.status === 'VALID') {
      this.observableSubject.next([getRegisterFormFormValues(this.registerForm), true]);
      this.topNotification.setMessage(AUTO_LOGIN_NOTIFICATION);
    }
  }
}

class RepeatPasswordFormErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    const formErrors = form.form.errors && form.form.errors.passwordRepeatError;
    return !!(control && (control.invalid || formErrors) && (control.dirty || control.touched || isSubmitted));
  }
}
