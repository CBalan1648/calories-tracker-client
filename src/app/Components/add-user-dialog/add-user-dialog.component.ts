import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { AdminService } from 'src/app/Services/admin.service';
import { RegisterService } from 'src/app/Services/register.service';
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

  registerForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit() {
    this.observableSubscription = this.registerService.connectRequestObservable(this.observableSubject);
  }

  ngOnDestroy() {
    this.registerService.disconnectRequestObservable(this.observableSubscription);
  }

  submitForm() {
    if (this.registerForm.status === 'VALID') {
      const formValues = this.registerForm.controls;

      this.observableSubject.next([{
        firstName: formValues.firstName.value,
        lastName: formValues.lastName.value,
        email: formValues.email.value,
        password: formValues.password.value
      }, false]);

      this.adminService.getUsers();
      this.onClose();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

