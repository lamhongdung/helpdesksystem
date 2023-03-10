import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {


  constructor() { }

  private subject = new Subject<any>();

  // subject fires a next value
  sendClickEvent() {
    this.subject.next("any thing");
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}