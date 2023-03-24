import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  // 'http://localhost:8080'
  host = environment.apiUrl;

  // number of teams per page(default = 5)
  pageSize = environment.pageSize;


  constructor() { }

  private subject = new Subject<any>();

  // subject fires a next value
  sendClickEvent() {
    this.subject.next("any thing");
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  // calculate total pages for pagination
  calculateTotalPages(totalOfCalendars: number, pageSize: number): number {

    if ((totalOfCalendars % pageSize) != 0) {
      //  Math.floor: rounds down and returns the largest integer less than or equal to a given number
      return (Math.floor(totalOfCalendars / pageSize)) + 1;
    }

    return totalOfCalendars / pageSize;

  } // end of calculateTotalPages()

  // count index for current page
  // ex:  page 1: ord 1 --> ord 5
  //      page 2: ord 6 --> ord 10 (not repeat: ord 1 --> ord 5)
  // parameters:
  //  - currentPage: current page
  //  - index: running variable(the index variable of "for loop")
  indexBasedPage(pageSize: number, currentPage: number, index: number): number {

    return (pageSize * (currentPage - 1)) + (index + 1);

  } // end of indexBasedPage()

  // count "nth element" in MySQL
  countNthElement(pageSize: number, currentPage: number): number {

    return (pageSize) * (currentPage - 1);

  }

}