import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopNotificationService {
  private subject = new Subject<any>();

  constructor() { }

  public setMessage(message: string): void {
    this.subject.next(message);
  }

  public getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
