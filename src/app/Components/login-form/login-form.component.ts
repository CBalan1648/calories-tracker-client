import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { LoginService } from '../../Services/login.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnDestroy, OnInit {

  private observableSubject: Subject<any> = new Subject();
  private observableSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService) { }

  loginForm = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required]
  });

  ngOnInit() {
    this.observableSubscription = this.loginService.connectRequestObservable(this.observableSubject);
  }

  ngOnDestroy() {
    this.loginService.disconnectRequestObservable(this.observableSubscription);
  }

  submitForm() {
    if (this.loginForm.status === 'VALID') {
      const formValues = this.loginForm.controls;

      this.observableSubject.next({
        email: formValues.email.value,
        password: formValues.password.value
      });
    }
  }
}
