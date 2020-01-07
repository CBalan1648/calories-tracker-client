import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUserDialogComponent } from './search-user-dialog.component';

describe('SearchUserDialogComponent', () => {
  let component: SearchUserDialogComponent;
  let fixture: ComponentFixture<SearchUserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchUserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
