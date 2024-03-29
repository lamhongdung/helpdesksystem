import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TicketStatus } from '../enum/TicketStatus';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  // 'http://localhost:8080'
  host = environment.apiUrl;

  // number of teams per page(default = 5)
  pageSize = environment.pageSize;

  // max file size
  maxFileSize = environment.maxFileSize;

  // tooltips for pagination controls
  tooltips = new Map<string, string>(
    [
      ["firstPage", "Go to the first page"],
      ["previousPage", "Go to previous page"],
      ["currentPage", "Current page"],
      ["totalPages", "Total pages"],
      ["goPage", "Go to specific page"],
      ["nextPage", "Go to next page"],
      ["lastPage", "Go to the last page"]
    ]
  );

  constructor(

  ) { }

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

  // display total of elements found.
  // ex: "There are 5 tickets", "There are 3 teams",...
  displayTotalOfElements(totalOfElements: number, singleElement: string, pluralElement: string): string {

    if (totalOfElements > 1) {
      return `There are ${totalOfElements} ${pluralElement}`;
    }
    else if ((totalOfElements === 1)) {
      return `There is ${totalOfElements} ${singleElement}`;
    }
    else {
      return `There is no ${singleElement}`;
    }

  } // end of displayTotalOfElements()

  // display why a ticket is 'on time' or 'late'
  tooltipSlaDetail(ticketStatusid: number, createTime: Date, lastUpdateDatetime: Date,
    currentDatetime: Date, limitTimeToResolve: string, spentDayHhmm: string,
    sla: string): string {

    // SLA datetime
    let slaDatetime: Date

    // tooltip SLA detail
    let tooltipSlaDetail: string;

    let ticketStatus: { [key: number]: string; } = {
      1: "Open",
      2: "Assigned",
      3: "Resolved",
      4: "Closed",
      5: "Cancel"
    }

    // if ticketStatusid === 4(Closed) or ticketStatusid === 5(Cancel) then slaDatetime = lastUpdateDatetime
    // else slaDatetime = currentDatetime
    if (lastUpdateDatetime != null && currentDatetime != null){

      slaDatetime = (ticketStatusid === TicketStatus.Closed || ticketStatusid === TicketStatus.Cancel) ? lastUpdateDatetime : currentDatetime
    }

    // ticketStatus[1]: "Open"
    // ticketStatus[2]: "Assigned"
    // ...
    tooltipSlaDetail = "";
    tooltipSlaDetail = tooltipSlaDetail + `- Status: <b>${ticketStatus[ticketStatusid]}</b>`
    tooltipSlaDetail = tooltipSlaDetail + `<br>- From datetime: <b>${formatDate(createTime?.toLocaleString(), "yyyy-MM-dd HH:mm:ss", "en-US")} </b>`
    tooltipSlaDetail = tooltipSlaDetail + `<br>- To datetime: <b>${formatDate(slaDatetime?.toLocaleString(), "yyyy-MM-dd HH:mm:ss", "en-US")} </b>`
    tooltipSlaDetail = tooltipSlaDetail + `<br>- Limit time to resolve ticket: <b>${limitTimeToResolve}</b> hours`
    tooltipSlaDetail = tooltipSlaDetail + `<br>- Spent hours: <b>${spentDayHhmm}</b>`
    tooltipSlaDetail = tooltipSlaDetail + `<br>-> <b>SLA</b>: ${sla}`

    return tooltipSlaDetail;
  } // end of tooltipSlaDetail()

}