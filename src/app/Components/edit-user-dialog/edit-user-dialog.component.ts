import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { getEditUserFormValues } from 'src/app/Helpers/functions.static';
import { editUserFormConfig } from 'src/app/Helpers/objects.static';
import { User } from 'src/app/Models/user';
import { AdminService } from 'src/app/Services/admin.service';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
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

  userProfileForm = this.formBuilder.group(editUserFormConfig(this.userData));

  ngOnInit() {
    this.userObservableSubscription = this.adminService.connectEditUserRequestObservable(this.userObservableSubject);
  }

  ngOnDestroy() {
    this.adminService.disconnectObservable(this.userObservableSubscription);
  }

  submitForm() {
    if (this.userProfileForm.status === 'VALID') {

    this.userObservableSubject.next(getEditUserFormValues(this.userProfileForm, this.userData));
    this.onClose();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
