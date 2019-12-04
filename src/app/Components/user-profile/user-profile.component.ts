import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { getEditUserFormValues } from 'src/app/Helpers/functions.static';
import { userProfileFormConfig } from 'src/app/Helpers/objects.static';
import { User } from 'src/app/Models/user';
import { MealsService } from 'src/app/Services/meals.service';
import { UserService } from 'src/app/Services/user.service';
import { TopNotificationService } from '../../Services/top-notification.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  private mealsObservableSubscription: Subscription;
  private userObservableSubscription: Subscription;
  public buttonMessage = 'Edit';
  public editing = false;
  public stats: {
    totalMeals: number,
    totalCalories: number,
    averageCalories: string,
  };

  private editUserObservableSubject: Subject<any> = new Subject();
  private editUserObservableSubscription: Subscription;

  private user: User;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private topNotification: TopNotificationService,
              private mealsService: MealsService) { }

  userProfileForm = this.formBuilder.group(userProfileFormConfig);

  enableFormEditing() {
    this.userProfileForm.controls.firstName.enable();
    this.userProfileForm.controls.lastName.enable();
    this.userProfileForm.controls.calories.enable();
  }

  disableFormEditing() {
    this.userProfileForm.controls.firstName.disable();
    this.userProfileForm.controls.lastName.disable();
    this.userProfileForm.controls.calories.disable();
  }

  resetForm(user) {
    this.userProfileForm.controls.firstName.setValue(user.firstName);
    this.userProfileForm.controls.lastName.setValue(user.lastName);
    this.userProfileForm.controls.email.setValue(user.email);
    this.userProfileForm.controls.calories.setValue(user.targetCalories);
  }

  save() {
    if (this.userProfileForm.status !== 'VALID') { return void 0; }

    this.editUserObservableSubject.next(getEditUserFormValues(this.userProfileForm, this.user));

    this.disableFormEditing();
    this.editing = false;
    this.buttonMessage = 'Edit';
    this.topNotification.setMessage('Something something update successful');
  }

  edit() {
    this.enableFormEditing();
    this.buttonMessage = 'Save';
    this.editing = true;
  }

  abort() {
    this.disableFormEditing();
    this.resetForm(this.user);
    this.buttonMessage = 'Edit';
    this.editing = false;
  }

  ngOnInit() {
    this.editUserObservableSubscription = this.userService.connectRequestObservable(this.editUserObservableSubject);
    this.userObservableSubscription = this.userService.getUserObservable().pipe(filter(user => !!user)).subscribe(user => {
      this.resetForm(user);
      this.user = user;
    });

    this.mealsObservableSubscription = this.mealsService.getRawObservable(this.user._id).subscribe(meals => {
      let calculatedStats = {
        totalMeals: 0,
        totalCalories: 0,
        averageCalories: '',
      };

      calculatedStats = meals.reduce((statsCounter, currentValue) => {
        statsCounter.totalCalories += currentValue.calories;
        return statsCounter;
      }, calculatedStats);

      calculatedStats.totalMeals = meals.length;
      calculatedStats.averageCalories = Number(calculatedStats.totalCalories / calculatedStats.totalMeals).toFixed(2);

      this.stats = calculatedStats;
    });
  }

  ngOnDestroy() {
    this.userService.disconnectRequestObservable(this.editUserObservableSubscription);
    this.userObservableSubscription.unsubscribe();
    this.mealsObservableSubscription.unsubscribe();
  }
}
