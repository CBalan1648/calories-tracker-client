import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TopNotificationService } from 'src/app/services/top-notification.service';
import { TopNotificationComponent } from './top-notification.component';

const testString = 'testString'

describe('TopNotificationComponent Template', () => {
    let component: TopNotificationComponent;
    let fixture: ComponentFixture<TopNotificationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TopNotificationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TopNotificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should render a the container div with the "hidden" class', () => {
        const notificationContainerClassList = fixture.debugElement.query(By.css('div')).nativeElement.classList;

        expect([...notificationContainerClassList].includes('notification-hidden')).toBeTruthy();
    });

    it('Should render a the container div with the "shown" class', () => {

        component.message = testString;
        fixture.detectChanges();

        const notificationContainerClassList = fixture.debugElement.query(By.css('div')).nativeElement.classList;

        expect([...notificationContainerClassList].includes('notification-shown')).toBeTruthy();
    });

    it('Should render the provided string in the notification span', () => {

        component.message = testString;
        fixture.detectChanges();

        const notificationMessage = fixture.debugElement.query(By.css('span')).nativeElement.innerHTML.trim();

        expect(notificationMessage).toEqual(testString);
    });

});

describe('TopNotificationComponent', () => {
    let component: TopNotificationComponent;
    const service = new TopNotificationService();

    beforeEach(() => {
        component = new TopNotificationComponent(service);
    });

    it('Should set the message', () => {
        expect(component.message).toBe(null);

        component.showMessage(testString);

        expect(component.message).toEqual(testString);
    });

    it('Should delete the message the message', () => {
        expect(component.message).toBe(null);

        component.showMessage(testString);

        expect(component.message).toEqual(testString);

        component.hideMessage();

        expect(component.message).toBe(null);
    });

    it('Should subscribe to the service observable', () => {

        spyOn(service, 'getMessage').and.callThrough();

        component.ngOnInit();

        expect(service.getMessage).toHaveBeenCalledTimes(1);
    });

    it('Should unsubscribe from the service observable', () => {

        spyOn(service, 'getMessage').and.callThrough();

        component.ngOnInit();

        expect(service.getMessage).toHaveBeenCalledTimes(1);

        spyOn(component.subscription, 'unsubscribe');

        component.ngOnDestroy();

        expect(component.subscription.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('Should call show message in the subscribe pipe', () => {

        spyOn(service, 'getMessage').and.callThrough();
        spyOn(component, 'showMessage');

        component.ngOnInit();

        expect(service.getMessage).toHaveBeenCalledTimes(1);

        expect(component.showMessage).toHaveBeenCalledTimes(0);

        service.setMessage(testString);

        expect(component.showMessage).toHaveBeenCalledTimes(1);
        expect(component.showMessage).toHaveBeenCalledWith(testString);
    });

    it('Should call hide message after 3 seconds in the subscribe pipe', fakeAsync(() => {

        spyOn(service, 'getMessage').and.callThrough();
        spyOn(component, 'showMessage');
        spyOn(component, 'hideMessage');

        component.ngOnInit();

        expect(service.getMessage).toHaveBeenCalledTimes(1);
        expect(component.showMessage).toHaveBeenCalledTimes(0);

        service.setMessage(testString);

        expect(component.showMessage).toHaveBeenCalledTimes(1);
        expect(component.showMessage).toHaveBeenCalledWith(testString);
        expect(component.hideMessage).toHaveBeenCalledTimes(0);

        tick(4000);

        expect(component.hideMessage).toHaveBeenCalledTimes(1);
    }));
});

