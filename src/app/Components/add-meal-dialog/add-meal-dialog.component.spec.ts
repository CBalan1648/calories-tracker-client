import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMealDialogComponent } from './add-meal-dialog.component';

describe('AddMealDialogComponent', () => {
  let component: AddMealDialogComponent;
  let fixture: ComponentFixture<AddMealDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMealDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMealDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
