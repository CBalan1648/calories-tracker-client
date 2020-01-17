import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopNotificationService {
  readonly subject = new Subject<any>();

  constructor() { }

  public setMessage(message: string): void {
    this.subject.next(message);
  }

  public getMessage(): Observable<any> {
    return this.subject;
  }
}

export const JWT_LOGIN_NOTIFICATION = 'Signing in, please wait';
export const AUTO_LOGIN_NOTIFICATION = 'Hello, this is a notification form - Register Form';
export const PROFILE_UPDATE_SUCCESSFUL = 'Something something update successful'
