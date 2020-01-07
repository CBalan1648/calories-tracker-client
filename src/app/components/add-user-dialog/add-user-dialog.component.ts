import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { getRegisterFormFormValuesAdmin } from 'src/app/helpers/functions.static';
import { addUserFormConfig } from 'src/app/helpers/objects.static';
import { AdminService } from 'src/app/services/admin.service';
import { RegisterService } from 'src/app/services/register.service';
import { AddMealDialogComponent } from '../add-meal-dialog/add-meal-dialog.component';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit, OnDestroy {

  private observableSubject: Subject<any> = new Subject();
  private observableSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private registerService: RegisterService,
              private adminService: AdminService,
              public dialogRef: MatDialogRef<AddMealDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, ) { }

  registerForm = this.formBuilder.group(addUserFormConfig);

  ngOnInit() {
    this.observableSubscription = this.registerService.connectRequestObservableAdmin(this.observableSubject);
  }

  ngOnDestroy() {
    this.registerService.disconnectRequestObservable(this.observableSubscription);
  }

  submitForm() {
    if (this.registerForm.status === 'VALID') {
      this.observableSubject.next([getRegisterFormFormValuesAdmin(this.registerForm), false]);
      this.adminService.getUsers();
      this.onClose();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

