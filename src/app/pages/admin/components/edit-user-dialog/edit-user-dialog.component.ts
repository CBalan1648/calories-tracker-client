import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { getEditUserFormValues } from 'src/app/helpers/functions.static';
import { editUserFormConfig } from 'src/app/helpers/objects.static';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit, OnDestroy {

  public userObservableSubject: Subject<any> = new Subject();
  public userObservableSubscription: Subscription;
  public editUserForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private readonly adminService: AdminService,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: User,
  ) { }

  ngOnInit() {
    this.editUserForm = this.formBuilder.group(editUserFormConfig(this.userData));
    this.userObservableSubscription = this.adminService.connectEditUserRequestObservable(this.userObservableSubject);
  }

  ngOnDestroy() {
    this.adminService.disconnectObservable(this.userObservableSubscription);
  }

  submitForm() {
    if (this.editUserForm.status === 'VALID') {
      this.userObservableSubject.next(getEditUserFormValues(this.editUserForm, this.userData));
      this.onClose();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
