import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealsContainerComponent } from './meals-container.component';

describe('MealsContainerComponent', () => {
  let component: MealsContainerComponent;
  let fixture: ComponentFixture<MealsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
