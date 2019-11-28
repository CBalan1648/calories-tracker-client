import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { User } from 'src/app/Models/user';
import { UserService } from 'src/app/Services/user.service';
import { AdminService } from 'src/app/Services/admin.service';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent implements OnInit, OnDestroy {

  private userObservableSubject: Subject<any> = new Subject();
  private userObservableSubscription: Subscription;

  constructor(
    private readonly adminService: AdminService,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public userData: User,
  ) { }

  userProfileForm = this.formBuilder.group({
    firstName: [this.userData.firstName, Validators.required],
    lastName: [this.userData.lastName, Validators.required],
    email: [this.userData.email],
    targetCalories: [this.userData.targetCalories, [Validators.required]],
    authLevel: [this.userData.authLevel, Validators.required],
  });


  ngOnInit() {
    this.userObservableSubscription = this.adminService.connectEditUserRequestObservable(this.userObservableSubject);
  }

  ngOnDestroy() {
    this.adminService.disconnectObservable(this.userObservableSubscription);
  }

  submitForm() {
    if (this.userProfileForm.status !== 'VALID') { return void 0; }

    const formValues = this.userProfileForm.controls;

    this.userObservableSubject.next({
      _id: this.userData._id,
      authLevel: formValues.authLevel.value,
      token: this.userData.token,
      firstName: formValues.firstName.value,
      lastName: formValues.lastName.value,
      email: formValues.email.value,
      targetCalories: formValues.targetCalories.value,
    });

    this.onClose();
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
