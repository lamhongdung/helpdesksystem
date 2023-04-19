import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { SearchStatus } from 'src/app/enum/SearchStatus';
import { DropdownResponse } from 'src/app/payload/DropdownResponse';
import { WorkloadReportResponse } from 'src/app/payload/WorkloadReportReponse';
import { NotificationService } from 'src/app/service/notification.service';
import { ReportService } from 'src/app/service/report.service';
import { ShareService } from 'src/app/service/share.service';
import { TicketService } from 'src/app/service/ticket.service';

@Component({
  selector: 'app-workload-report',
  templateUrl: './workload-report.component.html',
  styleUrls: ['./workload-report.component.css']
})
export class WorkloadReportComponent {

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // current page
  currentPage: number = 1;
  // total pages
  totalPages: number;
  // total of workloads(for pagination)
  totalOfWorkloads: number;

  // contain report result(grid data)
  workloadReportResponses: WorkloadReportResponse[] = [];
  // number of records per page(default = 5)
  pageSize: number;

  // current date(ex: Vietnam local time).
  // ex: Vietname time: 10:08 a.m, 21-Mar-2023
  // => new Date() = Tue Mar 21 2023 10:08:29 GMT+0700 (Indochina Time)
  currentDate = new Date();

  // fromDate = current date(local time) in format "yyyy-MM-dd"
  fromDate = formatDate(this.currentDate.toLocaleString(), "yyyy-MM-dd", "en-US");

  // toDate = current date(local time) in format "yyyy-MM-dd"
  toDate = formatDate(this.currentDate.toLocaleString(), "yyyy-MM-dd", "en-US");

  // all active teams + 1 dummy
  teams: DropdownResponse[] = [];

  // all Supporters + 1 dummy
  supporters: DropdownResponse[] = [];

  //
  // tooltips
  //

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
    teamid: ['0'],
    // default value = 0(all)
    supporterid: ["0"]

  });


  constructor(
    private shareService: ShareService,
    private reportService: ReportService,
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

    // initialize page size(default = 5)
    this.pageSize = this.shareService.pageSize;

    // initial current page(in the front end)
    this.currentPage = 1;

    // tooltips
    this.loadTooltip();

    // initial values for 2 dropdowns Team and Supporter
    this.loadDropdownValues();

    // show first page of 'workload report'.
    // 0: mean first page.
    this.viewReport(0, this.reportForm.value.fromDate, this.reportForm.value.toDate,
      this.reportForm.value.teamid, this.reportForm.value.supporterid);

  } // end of ngOnInit()


  // view report based on filter criteria
  viewReport(pageNumber: number, fromDate: string, toDate: string, teamid: string, supporterid: string) {

    // push to list of subscriptions for easily unsubscribes all subscriptions of the WorkloadReportComponent
    this.subscriptions.push(

      //
      // get reports
      //
      this.reportService.viewWorkloadReport(pageNumber, fromDate, toDate, teamid, supporterid)

        .subscribe({

          // get 'workload' report from database successful.
          next: (data: WorkloadReportResponse[]) => {

            return this.workloadReportResponses = data

          },

          // there are some errors when get 'workload report' from database
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }

        })
    );

    // push to list of subscriptions for easily unsubscribes all subscriptions of the WorkloadReportComponent
    this.subscriptions.push(

      //
      // get 'total of workloads' and 'total pages'
      //
      this.reportService.getTotalOfWorkloads(fromDate, toDate, teamid, supporterid)

        .subscribe({

          // get 'total of workloads' from database successful
          next: (data: number) => {

            // total of workloads
            this.totalOfWorkloads = data;

            // total pages
            this.totalPages = this.shareService.calculateTotalPages(this.totalOfWorkloads, this.pageSize);

          },

          // there are some errors when get total of workloads from database
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    )
  } // end of viewReport()

  // load posible values for 2 dropdowns 'Team' and 'Supporter'
  loadDropdownValues() {

    // load all active teams(+1 dummy) into the "Team" dropdown
    this.loadTeams();

    // load all supporters(+ 1 dummy) into the "Supporter" dropdown
    this.loadSupporters();

  } // end of loadDropdownValues()

  // load all active teams + 1 dummy
  loadTeams() {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get all active teams + 1 dummy
      this.reportService.getTeams(SearchStatus.ACTIVE)

        .subscribe({

          // get all active teams successful
          next: (data: DropdownResponse[]) => {

            // all active teams + 1 dummy
            this.teams = data;

          },

          // there are some errors when get teams
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    );

  } // end of loadAllTeams()

  // load all supporters + 1 dummy
  loadSupporters() {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get all supporters + 1 dummy.
      // SearchStatus.ALL = Active + Inactive
      this.reportService.getSupporters(SearchStatus.ALL)

        .subscribe({

          // get all supporters(+ 1 dummy) successful
          next: (data: DropdownResponse[]) => {

            // all supporters(+ 1 dummy)
            this.supporters = data;

          },

          // there are some errors when get supporters
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    );

  } // end of loadSupporters()

  // load tooltips
  loadTooltip() {

    //
    // tooltips
    //

    this.tooltips.set("fromDate", "- From ticket date(mm/dd/yyyy).<br>- Default value is current date");
    this.tooltips.set("toDate", "- To ticket date(mm/dd/yyyy).<br>- Default value is current date");
    this.tooltips.set("teamid", "- Team.<br>- 'All' means all teams.<br>- Values include: team id + team name + assignment method.");
    this.tooltips.set("supporterid", "- Supporter.<br>- 'All' means all supporters.<br>- Values include: Supporter id + fullname + status.");
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

      // get workloads, total of workloads and total of pages
      this.viewReport(
        nth_element,
        this.reportForm.value.fromDate,
        this.reportForm.value.toDate,
        this.reportForm.value.teamid,
        this.reportForm.value.supporterid);
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

      // get workloads, total of workloads and total of pages
      this.viewReport(
        nth_element,
        this.reportForm.value.fromDate,
        this.reportForm.value.toDate,
        this.reportForm.value.teamid,
        this.reportForm.value.supporterid);
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

      // get workloads, total of workloads and total of pages
      this.viewReport(
        nth_element,
        this.reportForm.value.fromDate,
        this.reportForm.value.toDate,
        this.reportForm.value.teamid,
        this.reportForm.value.supporterid);
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

      // get workloads, total of workloads and total of pages
      this.viewReport(
        nth_element,
        this.reportForm.value.fromDate,
        this.reportForm.value.toDate,
        this.reportForm.value.teamid,
        this.reportForm.value.supporterid);
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

      // get workloads, total of workloads and total of pages
      this.viewReport(
        nth_element,
        this.reportForm.value.fromDate,
        this.reportForm.value.toDate,
        this.reportForm.value.teamid,
        this.reportForm.value.supporterid);
    }
  } // end of moveLast()


  // display total of elements is on the top-right of the table
  displayTotalOfElements(totalOfElements: number, singleElement: string, pluralElement: string): string {

    return this.shareService.displayTotalOfElements(totalOfElements, singleElement, pluralElement);

  } // end of displayTotalOfElements()

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
