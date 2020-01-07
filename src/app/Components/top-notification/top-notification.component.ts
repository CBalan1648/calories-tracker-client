import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { TopNotificationService } from '../../services/top-notification.service';

@Component({
  selector: 'app-top-notification',
  templateUrl: './top-notification.component.html',
  styleUrls: ['./top-notification.component.scss']
})
export class TopNotificationComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  public message = null;

  constructor(private notificationService: TopNotificationService) { }

  ngOnInit() {
    this.subscription = this.notificationService.getMessage().pipe(
      tap(this.showMessage.bind(this)),
      delay(3000),
      tap(this.hideMessage.bind(this))
    ).subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showMessage(message) {
    this.message = message;
  }

  hideMessage() {
    this.message = null;
  }

}
