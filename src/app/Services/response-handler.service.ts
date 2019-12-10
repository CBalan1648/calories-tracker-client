import { Injectable } from '@angular/core';
import { TopNotificationService } from './top-notification.service';

@Injectable({
  providedIn: 'root'
})
export class ResponseHandlerService {

  constructor(private topNotification: TopNotificationService) { }

  handleResponseCode(type, statusCode) {
    this.topNotification.setMessage(messages[type][statusCode]);
  }
}

// TODO : Write better messages
const messages = {
  user: {
    0: 'There are some connectivity issue, please try again later',
    404: 'Your account could not be found, please make sure the data is correct.',
    400: 'There were some errors in the input data, please check and try again',
  },
  meal: {
    0: 'There are some connectivity issue, please try again later',
    404: 'Your meal could not be found, please make sure the data is correct.',
    400: 'There were some errors in the input data, please check and try again',
  }
};

