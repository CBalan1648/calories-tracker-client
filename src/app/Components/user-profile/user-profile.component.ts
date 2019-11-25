import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { User } from 'src/app/Models/user';
import { UserService } from 'src/app/Services/user.service';
import { TopNotificationService } from '../../Services/top-notification.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  private observableSubject: Subject<any> = new Subject();
  private observableSubscription: Subscription;
  public buttonMessage = 'Edit';
  public editing = false;

  private user: User;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private topNotification: TopNotificationService) { }

  registerForm = this.formBuilder.group({
    firstName: [{ value: '', disabled: true }, Validators.required],
    lastName: [{ value: '', disabled: true }, Validators.required],
    email: [{ value: '', disabled: true }, [Validators.email, Validators.required]],
  });

  enableFormEditing() {
    this.registerForm.controls.firstName.enable();
    this.registerForm.controls.lastName.enable();
  }

  disableFormEditing() {
    this.registerForm.controls.firstName.disable();
    this.registerForm.controls.lastName.disable();
  }

  resetForm(user) {
    this.registerForm.controls.firstName.setValue(user.firstName);
    this.registerForm.controls.lastName.setValue(user.lastName);
    this.registerForm.controls.email.setValue(user.email);
  }

  save() {
    this.disableFormEditing();
    this.resetForm(this.user);
    this.buttonMessage = 'Edit';
    this.editing = false;
  }

  edit() {
    this.enableFormEditing();

    this.buttonMessage = 'Save';
    this.editing = true;
  }

  ngOnInit() {
    this.observableSubscription = this.userService.getUserObservable().pipe(filter(user => !!user)).subscribe(user => {
      this.resetForm(user);

      this.user = user;
    });
  }

  ngOnDestroy() {
    this.observableSubscription.unsubscribe();
  }
}
