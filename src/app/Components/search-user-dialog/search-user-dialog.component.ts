import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AdminService } from 'src/app/Services/admin.service';

@Component({
  selector: 'app-search-user-dialog',
  templateUrl: './search-user-dialog.component.html',
  styleUrls: ['./search-user-dialog.component.scss']
})
export class SearchUserDialogComponent implements OnInit, OnDestroy {

  private inputFieldDataSubject = new BehaviorSubject({ searchString: '', searchAuthLevel: '' });
  private filterSubscription: Subscription;
  private formChangeSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    public dialogRef: MatSnackBarRef<SearchUserDialogComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { searchString: string, searchAuthLevel: string }
  ) { }

  searchUserForm = this.formBuilder.group({
    searchString: [this.data.searchString],
    searchAuthLevel: [this.data.searchAuthLevel],
  });

  ngOnInit() {
    this.filterSubscription = this.adminService.connectFilterObservable(this.inputFieldDataSubject.asObservable());
    this.formChangeSubscription = this.searchUserForm.valueChanges.subscribe(this.onChange.bind(this));
  }

  ngOnDestroy() {
    this.adminService.disconnectObservable(this.filterSubscription);
    this.formChangeSubscription.unsubscribe();
  }

  onChange(formValue) {
    this.inputFieldDataSubject.next(formValue);
  }

  close() {
    this.dialogRef.dismiss();
  }
}
