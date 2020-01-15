import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundComponent } from './not-found.component';
import { By } from '@angular/platform-browser';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should render a div with "pageNotFoundString" string', () => {
    const componentContainerText = fixture.debugElement.query(By.css('.not-found-container')).nativeElement.innerHTML.trim();

    expect(componentContainerText).toEqual(component.pageNotFoundString);
  });

  it('Page not found String should include a sad emote', () => {
    expect(component.pageNotFoundString.includes(':(')).toBeTruthy();
  });
});
