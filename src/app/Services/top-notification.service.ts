import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopNotificationService {
  private subject = new Subject<any>();

  constructor() { }

  setMessage(message: string): void {
    console.log("MESSAGE SET")
    this.subject.next(message);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
