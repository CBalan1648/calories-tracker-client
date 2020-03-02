import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { getLoginFormValues } from 'src/app/helpers/functions.static';
import { loginFormConfig } from 'src/app/helpers/objects.static';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginFormComponent implements OnDestroy, OnInit {

  public observableSubject: Subject<any> = new Subject();
  public observableSubscription: Subscription;
  public loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, readonly loginService: LoginService) { }

  ngOnInit() {
    this.observableSubscription = this.loginService.connectRequestObservable(this.observableSubject);
    this.loginForm = this.formBuilder.group(loginFormConfig);
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
