import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { loginFormConfig } from 'src/app/helpers/objects.static';
import { getLoginFormValues } from 'src/app/helpers/functions.static';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnDestroy, OnInit {

  private observableSubject: Subject<any> = new Subject();
  private observableSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService) { }

  loginForm = this.formBuilder.group(loginFormConfig);

  ngOnInit() {
    this.observableSubscription = this.loginService.connectRequestObservable(this.observableSubject);
  }

  ngOnDestroy() {
    this.loginService.disconnectRequestObservable(this.observableSubscription);
  }

  submitForm() {
    if (this.loginForm.status === 'VALID') {
      this.observableSubject.next(getLoginFormValues(this.loginForm));
    }
  }
}
