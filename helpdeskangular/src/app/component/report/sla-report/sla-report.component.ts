import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { DropdownResponse } from 'src/app/payload/DropdownResponse';
import { SlaReportDetail } from 'src/app/payload/SlaReportDetail';
import { SlaReportHeader } from 'src/app/payload/SlaReportHeader';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReportService } from 'src/app/service/report.service';
import { ShareService } from 'src/app/service/share.service';
import { TicketService } from 'src/app/service/ticket.service';

@Component({
  selector: 'app-sla-report',
  templateUrl: './sla-report.component.html',
  styleUrls: ['./sla-report.component.css']
})
export class SlaReportComponent {

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // current page
  currentPage: number = 1;
  // total pages
  totalPages: number;
  // total of records(for pagination)
  totalOfSla: number;

  // summary report
  slaReportHeader: SlaReportHeader;
  // contain report detail(grid data)
  slaReportDetails: SlaReportDetail[] = [];
  // number of records per page(default = 5)
  pageSize: number;

  // user who logged in the system
  userid: number;

  // current date(ex: Vietnam local time).
  // ex: Vietname time: 10:08 a.m, 21-Mar-2023
  // => new Date() = Tue Mar 21 2023 10:08:29 GMT+0700 (Indochina Time)
  currentDate = new Date();

  // fromDate = first day of current month(local time) in format "yyyy-MM-dd"
  fromDate = formatDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1)
    .toLocaleString(), "yyyy-MM-dd", "en-US");

  // toDate = current date(local time) in format "yyyy-MM-dd"
  toDate = formatDate(this.currentDate.toLocaleString(), "yyyy-MM-dd", "en-US");

  // get teams by user id and based on tickets between fromDate and toDate + 1 dummy
  teams: DropdownResponse[] = [];

  // tooltips:
  // ex:  tooltips.set('key', 'value');
  //      tooltips.get('key') --> return 'value';
  tooltips = new Map<string, string>();

  // tooltips for pagination
  tooltipFirstPage: string;
  tooltipPreviousPage: string;
  tooltipCurrentPage: string;
  tooltipTotalPages: string;
  tooltipGoPage: string;
  tooltipNextPage: string;
  tooltipLastPage: string;

  // the "reportForm"(filter form)
  reportForm = this.formBuilder.group({

    // current date
    fromDate: [''],
    // current date
    toDate: [''],
    // default value = 0(all)
    teamid: ['0']

  });


  constructor(
    private reportService: ReportService,
    private ticketService: TicketService,
    private authService: AuthService,
    private shareService: ShareService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {

    // fromDate = current date(local)
    this.reportForm.controls['fromDate'].setValue(this.fromDate);

    // toDate = current date(local)
    this.reportForm.controls['toDate'].setValue(this.toDate);

  }

  // this method ngOnInit() is run right after the contructor
  ngOnInit(): void {

    // initial page size(default = 5)
    this.pageSize = this.shareService.pageSize;

    // initial current page(in the front end)
    this.currentPage = 1;

    // user id who has logged in the system.
    // the '+' sign means convert string to number
    this.userid = +this.authService.getIdFromLocalStorage();

    // tooltips
    this.loadTooltip();

    // initial posible values for dropdown 'Team'
    this.loadTeamsByUserid(this.userid)

    // show first page of 'sla report'.
    // 0: mean first page.
    this.viewReport(this.userid, 0, this.reportForm.value.fromDate,
      this.reportForm.value.toDate, this.reportForm.value.teamid);

  } // end of ngOnInit()


  // view report based on filter criteria
  viewReport(userid: number, pageNumber: number, fromDate: string, toDate: string, teamid: string) {

    // push to list of subscriptions for easily unsubscribes all subscriptions of the SlaReportComponent
    this.subscriptions.push(

      //
      // get report detail
      //
      this.reportService.viewSlaReportDetail(userid, pageNumber, fromDate, toDate, teamid)

        .subscribe({

          // get 'report detail'(grid) from database successful.
          next: (data: SlaReportDetail[]) => {

            return this.slaReportDetails = data

          },

          // there are some errors when get 'report detail'(grid) from database
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }

        })
    ); // end of this.subscriptions.push()

    // push to list of subscriptions for easily unsubscribes all subscriptions of the SlaReportComponent
    this.subscriptions.push(

      //
      // get report summary
      //
      this.reportService.viewSlaReportHeader(userid, fromDate, toDate, teamid)

        .subscribe({

          // get 'report summary' from database successful.
          next: (data: SlaReportHeader) => {

            // console.log(data);
            return this.slaReportHeader = data

          },

          // there are some errors when get 'report summary' from database
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }

        })
    ); // end of this.subscriptions.push()

    // push to list of subscriptions for easily unsubscribes all subscriptions of the SlaReportComponent
    this.subscriptions.push(

      //
      // get 'total of sla records' and 'total pages'
      //
      this.reportService.getTotalOfSla(userid, fromDate, toDate, teamid)

        .subscribe({

          // get 'total of sla records' from database successful
          next: (data: number) => {

            // total of sla records
            this.totalOfSla = data;

            // total pages
            this.totalPages = this.shareService.calculateTotalPages(this.totalOfSla, this.pageSize);

          },

          // there are some errors when get total of sla records from database
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })

    ) // end of this.subscriptions.push()

  } // end of viewReport()

  // load teams by userid(and by user role)
  loadTeamsByUserid(userid: number) {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get teams by userid(and by user role)
      this.ticketService.getTeamsByUserid(userid)

        .subscribe({

          // get teams successful
          next: (data: DropdownResponse[]) => {

            // teams by userid(and by user role)
            this.teams = data;

          },

          // there are some errors when get teams
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }

        })

    ); // end of this.subscriptions.push()

  } // end of loadTeamsByUserid()


  // load tooltips
  loadTooltip() {

    //
    // tooltips
    //

    this.tooltips.set("fromDate", "- From ticket date(mm/dd/yyyy).<br>- Default value is first day of current month");
    this.tooltips.set("toDate", "- To ticket date(mm/dd/yyyy).<br>- Default value is current date");
    this.tooltips.set("teamid", "- Team.<br>- 'All' means all teams.<br>- Values include: team id + team name.<br>- Only display teams have ticket.");
    this.tooltips.set("viewButton", "View report");

    //
    // tooltips for the "pagination"
    //

    this.tooltipFirstPage = this.shareService.tooltips.get("firstPage");
    this.tooltipPreviousPage = this.shareService.tooltips.get("previousPage");
    this.tooltipCurrentPage = this.shareService.tooltips.get("currentPage");
    this.tooltipTotalPages = this.shareService.tooltips.get("totalPages");
    this.tooltipGoPage = this.shareService.tooltips.get("goPage");
    this.tooltipNextPage = this.shareService.tooltips.get("nextPage");
    this.tooltipLastPage = this.shareService.tooltips.get("lastPage");

  } // end of loadTooltip()

  // count index for current page
  // ex:  page 1: ord 1 --> ord 5
  //      page 2: ord 6 --> ord 10 (not repeat: ord 1 --> ord 5)
  // parameters:
  //  - currentPage: current page
  //  - index: running variable(the index variable of "for loop")
  indexBasedPage(pageSize: number, currentPage: number, index: number): number {

    return (this.shareService.indexBasedPage(pageSize, currentPage, index));
  }

  // go to specific page
  goPage() {

    // if (1 <= currentPage <= totalPages) then go to specific page
    if (this.currentPage >= 1 && this.currentPage <= this.totalPages) {

      // the "nth element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get sla, total of records and total of pages
      this.viewReport(
        this.userid,
        nth_element,
        this.reportForm.value.fromDate,
        this.reportForm.value.toDate,
        this.reportForm.value.teamid);
    }

  } // end of goPage()

  // user changes the page number in the text box
  changePageNumber(value: number) {
    this.currentPage = value;
  }

  // move to the first page
  moveFirst() {

    // if current page is not the first page
    if (this.currentPage > 1) {

      this.currentPage = 1;

      // the "nth element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get sla, total of records and total of pages
      this.viewReport(
        this.userid,
        nth_element,
        this.reportForm.value.fromDate,
        this.reportForm.value.toDate,
        this.reportForm.value.teamid);
    }

  } // end of moveFirst()

  // move to the next page
  moveNext() {

    // if current page is not the last page
    if (this.currentPage < this.totalPages) {

      this.currentPage = this.currentPage + 1;

      // the "nth element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get sla, total of records and total of pages
      this.viewReport(
        this.userid,
        nth_element,
        this.reportForm.value.fromDate,
        this.reportForm.value.toDate,
        this.reportForm.value.teamid);
    }

  } // end of moveNext()

  // move to the previous page
  movePrevious() {

    // if current page is not the first page
    if (this.currentPage > 1) {

      this.currentPage = this.currentPage - 1;

      // the "nth element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get sla, total of records and total of pages
      this.viewReport(
        this.userid,
        nth_element,
        this.reportForm.value.fromDate,
        this.reportForm.value.toDate,
        this.reportForm.value.teamid);
    }

  } // end of movePrevious()

  // move to the last page
  moveLast() {

    // if current page is not the last page
    if (this.currentPage < this.totalPages) {

      this.currentPage = this.totalPages;

      // the "nth element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get sla, total of records and total of pages
      this.viewReport(
        this.userid,
        nth_element,
        this.reportForm.value.fromDate,
        this.reportForm.value.toDate,
        this.reportForm.value.teamid);
    }
  } // end of moveLast()


  // // display total of elements is on the top-right of the table
  // displayTotalOfElements(totalOfElements: number, singleElement: string, pluralElement: string): string {

  //   return this.shareService.displayTotalOfElements(totalOfElements, singleElement, pluralElement);

  // } // end of displayTotalOfElements()

  // // display total of elements is on the top-right of the table
  // tooltipSlaDetail(ticketStatusid: number, createTime: Date, lastUpdateDatetime: Date,
  //   currentDatetime: Date, limitTimeToResolve: string, spentDayHhmm: string, sla: string): string {

  //   return this.shareService.tooltipSlaDetail(ticketStatusid, createTime, lastUpdateDatetime, currentDatetime,
  //     limitTimeToResolve, spentDayHhmm, sla);

  // } // end of tooltipSlaDetail()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "WorkloadReportComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
