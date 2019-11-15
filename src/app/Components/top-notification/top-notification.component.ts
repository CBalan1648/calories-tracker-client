import { Component, OnInit } from '@angular/core';
import { TopNotificationService } from '../../Services/top-notification.service'
import { Subscription } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-top-notification',
  templateUrl: './top-notification.component.html',
  styleUrls: ['./top-notification.component.css']
})
export class TopNotificationComponent implements OnInit {

  private subscription: Subscription
  public message = null

  constructor(private notificationService: TopNotificationService) {
  }

  ngOnInit() {
    this.subscription = this.notificationService.getMessage().pipe(
      tap(this.showMessage.bind(this)),
      delay(5000),
      tap(this.hideMessage.bind(this))
    ).subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showMessage(message) {
    this.message = message
  }

  hideMessage() {
    this.message = null
  }

}
