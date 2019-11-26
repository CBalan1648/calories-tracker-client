import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopNotificationService {
  private subject = new Subject<any>();

  constructor() { }

  setMessage(message: string): void {
    console.log("HELLO MESSAGE")
    this.subject.next(message);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
