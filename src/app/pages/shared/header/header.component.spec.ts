import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { HeaderComponent } from './header.component';

class MockUserService {
    public subject = new Subject<any>();
    logoutUser = () => { };
    getUserObservable = () => this.subject.asObservable();
}

describe('HeaderComponent Template', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let fakeSidenavOpen;
    let fakeSidenavClose;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatToolbarModule],
            declarations: [HeaderComponent],
            providers: [{
                provide: UserService,
                useClass: MockUserService
            },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {

        fakeSidenavOpen = {
            opened: true,
            open: () => { },
            close: () => { },
            toggle: () => { },
        };

        fakeSidenavClose = {
            opened: false,
            open: () => { },
            close: () => { },
            toggle: () => { },
        };

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;

    });

    it('Should create component', () => {
        component.sidenavRef = fakeSidenavOpen;
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('Should not render the "open sidenav" button', () => {

        component.sidenavRef = fakeSidenavOpen;

        fixture.detectChanges();

        const sidenavButton = fixture.debugElement.query(By.css('.header-sidebar-button'));

        expect(sidenavButton).toBeFalsy();
    });

    it('Should render the "open sidenav" button', () => {

        component.sidenavRef = fakeSidenavClose;

        fixture.detectChanges();

        const sidenavButton = fixture.debugElement.query(By.css('.header-sidebar-button')).nativeElement;

        expect(sidenavButton).toBeTruthy();
    });

    it('Should call sidenavRef.toggle() on click', () => {

        component.sidenavRef = fakeSidenavClose;

        spyOn(fakeSidenavClose, 'toggle');

        fixture.detectChanges();

        const sidenavButton = fixture.debugElement.query(By.css('.header-sidebar-button')).nativeElement;

        expect(fakeSidenavClose.toggle).toHaveBeenCalledTimes(0);

        sidenavButton.click();

        expect(fakeSidenavClose.toggle).toHaveBeenCalledTimes(1);
    });

    it('Should contain user first and last name in name-tag', () => {

        const firstName = 'testFirstName';
        const lastName = 'testLastName';

        component.sidenavRef = fakeSidenavClose;
        component.firstName = firstName;
        component.lastName = lastName;

        fixture.detectChanges();

        const nameTagContent = fixture.debugElement.query(By.css('.header-name-tag')).nativeElement.innerHTML.trim();

        expect(nameTagContent.includes(firstName)).toBeTruthy();
        expect(nameTagContent.includes(lastName)).toBeTruthy();

    });

    it('Should call logout() on logout button click', () => {

        component.sidenavRef = fakeSidenavOpen;

        spyOn(component, 'logout');

        fixture.detectChanges();

        const sidenavButton = fixture.debugElement.query(By.css('button')).nativeElement;

        expect(component.logout).toHaveBeenCalledTimes(0);

        sidenavButton.click();

        expect(component.logout).toHaveBeenCalledTimes(1);
    });

});

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    const service = new MockUserService() as unknown as UserService;
    let fakeSidenavClose;
    let fakeSidenavOpen;

    beforeEach(() => {
        component = new HeaderComponent(service);
        fakeSidenavOpen = {
            opened: true,
            open: () => { },
            close: () => { },
            toggle: () => { },
        };

        fakeSidenavClose = {
            opened: false,
            open: () => { },
            close: () => { },
            toggle: () => { },
        };
    });

    it('Should call sidenavRef.open() on init', () => {

        const firstName = 'testFirstName';
        const lastName = 'testLastName';

        component.sidenavRef = fakeSidenavClose;
        component.firstName = firstName;
        component.lastName = lastName;

        spyOn(fakeSidenavClose, 'open');

        expect(fakeSidenavClose.open).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(fakeSidenavClose.open).toHaveBeenCalledTimes(1);
    });

    it('Should call sidenavRef.close() on destroy', () => {

        const firstName = 'testFirstName';
        const lastName = 'testLastName';

        component.sidenavRef = fakeSidenavClose;
        component.firstName = firstName;
        component.lastName = lastName;

        spyOn(fakeSidenavClose, 'close');

        expect(fakeSidenavClose.close).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        component.ngOnDestroy();

        expect(fakeSidenavClose.close).toHaveBeenCalledTimes(1);
    });

    it('Should call unsubscribe on destroy', () => {

        const fakeSubscription = {
            unsubscribe: () => { },
        };

        const firstName = 'testFirstName';
        const lastName = 'testLastName';

        component.sidenavRef = fakeSidenavClose;
        component.firstName = firstName;
        component.lastName = lastName;

        spyOn(fakeSubscription, 'unsubscribe');

        expect(fakeSubscription.unsubscribe).toHaveBeenCalledTimes(0);

        component.ngOnInit();
        component.userServiceSubscriptions = fakeSubscription as unknown as Subscription;
        component.ngOnDestroy();

        expect(fakeSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('Should call service.getUserObservable() on init', () => {

        component.sidenavRef = fakeSidenavClose;

        spyOn(service, 'getUserObservable').and.callThrough();

        expect(service.getUserObservable).toHaveBeenCalledTimes(0);

        component.ngOnInit();

        expect(service.getUserObservable).toHaveBeenCalledTimes(1);
    });

    it('Should set own fields based on observable values', () => {

        const firstName = 'firstName';
        const lastName = 'lastName';

        component.sidenavRef = fakeSidenavClose;
        component.firstName = null;
        component.lastName = null;
        component.ngOnInit();

        (service as unknown as MockUserService).subject.next({ firstName, lastName });

        expect(component.firstName).toEqual(firstName);
        expect(component.lastName).toEqual(lastName);
    });

    it('Should filter invalid users from subscription', () => {

        const firstName = 'firstName';
        const lastName = 'lastName';

        component.sidenavRef = fakeSidenavClose;
        component.firstName = firstName;
        component.lastName = lastName;

        component.ngOnInit();

        (service as unknown as MockUserService).subject.next(undefined);

        expect(component.firstName).toEqual(firstName);
        expect(component.lastName).toEqual(lastName);
    });
});
