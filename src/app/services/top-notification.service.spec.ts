import { TopNotificationService } from './top-notification.service';
import { Observable } from 'rxjs';


describe('TopNotificationService', () => {
  let topNotificationService: TopNotificationService;

  beforeEach(() => {
    topNotificationService = new TopNotificationService();
  });

  it('Should call next on the notification subject with the given string', () => {
    spyOn(topNotificationService.subject, 'next');

    expect(topNotificationService.subject.next).toHaveBeenCalledTimes(0);

    topNotificationService.setMessage('HELLO');

    expect(topNotificationService.subject.next).toHaveBeenCalledTimes(1);
    expect(topNotificationService.subject.next).toHaveBeenCalledWith('HELLO');
  });

  it('Should return the notification subject as an observable', () => {

    const returnedObservable = topNotificationService.getMessage();

    expect(returnedObservable).toBeTruthy();
    expect(returnedObservable instanceof Observable).toBeTruthy();
    expect(returnedObservable).toEqual(topNotificationService.subject)
  });
});
