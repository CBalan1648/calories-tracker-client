import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { generateMealStats, getProfileFormValues } from 'src/app/helpers/functions.static';
import { userProfileFormConfig } from 'src/app/helpers/objects.static';
import { User } from 'src/app/models/user';
import { MealsService } from 'src/app/services/meals.service';
import { UserService } from 'src/app/services/user.service';
import { initialMealStats } from '../../helpers/objects.static';
import { ABORT_STRING, EDIT_STRING, SAVE_STRING } from '../../helpers/string';
import { TopNotificationService, PROFILE_UPDATE_SUCCESSFUL } from '../../services/top-notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public mealsObservableSubscription: Subscription;
  public userObservableSubscription: Subscription;

  public editUserObservableSubject: Subject<any> = new Subject();
  public editUserObservableSubscription: Subscription;

  public user: User;
  public buttonMessage = EDIT_STRING;
  public abortButtonMessage = ABORT_STRING;
  public editing = false;
  public stats = { ...initialMealStats };
  public userProfileForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private topNotification: TopNotificationService,
    private mealsService: MealsService
  ) { }



  ngOnInit() {
    this.userProfileForm = this.formBuilder.group(userProfileFormConfig);
    this.editUserObservableSubscription = this.userService.connectRequestObservable(this.editUserObservableSubject);
    this.userObservableSubscription = this.userService.getUserObservable().pipe(filter(user => !!user)).subscribe(user => {
      this.resetForm(user);
      this.user = user;
    });

    this.mealsObservableSubscription = this.mealsService.getRawObservable(this.user._id).subscribe(meals => {
      this.stats = generateMealStats(meals, initialMealStats);
    });
  }

  enableFormEditing() {
    this.userProfileForm.controls.firstName.enable();
    this.userProfileForm.controls.lastName.enable();
    this.userProfileForm.controls.targetCalories.enable();
  }

  disableFormEditing() {
    this.userProfileForm.controls.firstName.disable();
    this.userProfileForm.controls.lastName.disable();
    this.userProfileForm.controls.targetCalories.disable();
  }

  resetForm(user) {
    this.userProfileForm.controls.firstName.setValue(user.firstName);
    this.userProfileForm.controls.lastName.setValue(user.lastName);
    this.userProfileForm.controls.email.setValue(user.email);
    this.userProfileForm.controls.targetCalories.setValue(user.targetCalories);
  }

  save() {
    if (this.userProfileForm.status !== 'VALID') { return void 0; }

    this.editUserObservableSubject.next(getProfileFormValues(this.userProfileForm, this.user));

    this.disableFormEditing();
    this.editing = false;
    this.buttonMessage = EDIT_STRING;
    this.topNotification.setMessage(PROFILE_UPDATE_SUCCESSFUL);
  }

  edit() {
    this.enableFormEditing();
    this.buttonMessage = SAVE_STRING;
    this.editing = true;
  }

  abort() {
    this.disableFormEditing();
    this.resetForm(this.user);
    this.buttonMessage = EDIT_STRING;
    this.editing = false;
  }

  ngOnDestroy() {
    this.userService.disconnectRequestObservable(this.editUserObservableSubscription);
    this.userObservableSubscription.unsubscribe();
    this.mealsObservableSubscription.unsubscribe();
  }
}
