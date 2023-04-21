import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartOptions, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { DropdownResponse } from 'src/app/payload/DropdownResponse';
import { Last7DaysReportResponse } from 'src/app/payload/Last7DaysReportResponse';
import { SlaReportDetail } from 'src/app/payload/SlaReportDetail';
import { SlaReportHeader } from 'src/app/payload/SlaReportHeader';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReportService } from 'src/app/service/report.service';
import { ShareService } from 'src/app/service/share.service';
import { TicketService } from 'src/app/service/ticket.service';

@Component({
  selector: 'app-last7-days-report',
  templateUrl: './last7-days-report.component.html',
  styleUrls: ['./last7-days-report.component.css']
})
export class Last7DaysReportComponent {

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

  totalOfNewTickets: number = 0;
  totalOfSolvedTickets: number = 0;
  totalOfClosedTickets: number = 0;
  totalSpentHourOfSolvedClosed: number = 0;
  avgSolvedTime: number = 0;

  labels: string[] = [];
  data: number[] = [];

  // current date(ex: Vietnam local time).
  // ex: Vietname time: 10:08 a.m, 21-Mar-2023
  // => new Date() = Tue Mar 21 2023 10:08:29 GMT+0700 (Indochina Time)
  currentDate = new Date();

  // toDate = current date(local time) in format "yyyy-MM-dd"
  reportDate = formatDate(this.currentDate.toLocaleString(), "yyyy-MM-dd", "en-US");

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
    reportDate: ['']

  });
//
//
//

salesData: ChartData<'bar'> = {
  // labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  labels: [],
  datasets: [
    // { label: 'Mobiles', data: [1000, 1200, 1050, 2000, 500] }
    { label: '', data: [] }
    // { label: 'Laptop', data: [200, 100, 400, 50, 90] },
    // { label: 'AC', data: [500, 400, 350, 450, 650] },
    // { label: 'Headset', data: [1200, 1500, 1020, 1600, 900] },
  ],
};

chartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: false,
      text: 'Monthly Sales Data',
    },
  },
}

  constructor(
    private reportService: ReportService,
    private ticketService: TicketService,
    private authService: AuthService,
    private shareService: ShareService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {

    // toDate = current date(local)
    this.reportForm.controls['reportDate'].setValue(this.reportDate);

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
    this.viewReport(this.userid, this.reportForm.value.reportDate);

  } // end of ngOnInit()


  // view report based on filter criteria
  viewReport(userid: number, reportDate: string) {

    // push to list of subscriptions for easily unsubscribes all subscriptions of the SlaReportComponent
    this.subscriptions.push(

      //
      // get report detail
      //
      this.reportService.viewLast7DaysReport(userid, reportDate)

        .subscribe({

          // get 'report detail'(grid) from database successful.
          next: (data: Last7DaysReportResponse[]) => {

            this.labels.splice(0);
            this.data.splice(0);
            this.totalOfNewTickets = 0;
            this.totalOfSolvedTickets = 0;
            this.totalOfClosedTickets = 0;
            this.totalSpentHourOfSolvedClosed = 0;
            this.avgSolvedTime = 0;

            data.forEach(item => {
              this.labels.push(item.dayMonth);
              this.data.push(item.numOfNewTickets);
              this.totalOfNewTickets = this.totalOfNewTickets + item.numOfNewTickets;
              this.totalOfSolvedTickets = this.totalOfSolvedTickets + item.numOfSolvedTickets;
              this.totalOfClosedTickets = this.totalOfClosedTickets + item.numOfClosedTickets;
              this.totalSpentHourOfSolvedClosed = this.totalSpentHourOfSolvedClosed + item.totalSpentHour;
            }
            )

            if (this.totalOfSolvedTickets + this.totalOfClosedTickets == 0) {
              
              this.avgSolvedTime = 0;

            } else {
              this.avgSolvedTime = (this.totalSpentHourOfSolvedClosed*1.0)/(this.totalOfSolvedTickets + this.totalOfClosedTickets);
            }

            this.salesData = {
              labels: this.labels,
              datasets:[
                {
                  label: "New tickets",
                  data: this.data
                }
              ]
            }
          },

          // there are some errors when get 'report detail'(grid) from database
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }

        })
    ); // end of this.subscriptions.push()

    // // push to list of subscriptions for easily unsubscribes all subscriptions of the SlaReportComponent
    // this.subscriptions.push(

    //   //
    //   // get report summary
    //   //
    //   this.reportService.viewSlaReportHeader(userid, fromDate, toDate, teamid)

    //     .subscribe({

    //       // get 'report summary' from database successful.
    //       next: (data: SlaReportHeader) => {

    //         // console.log(data);
    //         return this.slaReportHeader = data

    //       },

    //       // there are some errors when get 'report summary' from database
    //       error: (errorResponse: HttpErrorResponse) => {

    //         // show the error message to user
    //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

    //       }

    //     })
    // ); // end of this.subscriptions.push()

    // // push to list of subscriptions for easily unsubscribes all subscriptions of the SlaReportComponent
    // this.subscriptions.push(

    //   //
    //   // get 'total of sla records' and 'total pages'
    //   //
    //   this.reportService.getTotalOfSla(userid, fromDate, toDate, teamid)

    //     .subscribe({

    //       // get 'total of sla records' from database successful
    //       next: (data: number) => {

    //         // total of sla records
    //         this.totalOfSla = data;

    //         // total pages
    //         this.totalPages = this.shareService.calculateTotalPages(this.totalOfSla, this.pageSize);

    //       },

    //       // there are some errors when get total of sla records from database
    //       error: (errorResponse: HttpErrorResponse) => {

    //         // show the error message to user
    //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

    //       }
    //     })

    // ) // end of this.subscriptions.push()

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

    this.tooltips.set("reportDate", "- To ticket date(mm/dd/yyyy).<br>- Default value is current date");
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
      // this.viewReport(
      //   this.userid,
      //   nth_element,
      //   this.reportForm.value.fromDate,
      //   this.reportForm.value.toDate,
      //   this.reportForm.value.teamid);
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
      // this.viewReport(
      //   this.userid,
      //   nth_element,
      //   this.reportForm.value.fromDate,
      //   this.reportForm.value.toDate,
      //   this.reportForm.value.teamid);
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
      // this.viewReport(
      //   this.userid,
      //   nth_element,
      //   this.reportForm.value.fromDate,
      //   this.reportForm.value.toDate,
      //   this.reportForm.value.teamid);
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
      // this.viewReport(
      //   this.userid,
      //   nth_element,
      //   this.reportForm.value.fromDate,
      //   this.reportForm.value.toDate,
      //   this.reportForm.value.teamid);
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
      // this.viewReport(
      //   this.userid,
      //   nth_element,
      //   this.reportForm.value.fromDate,
      //   this.reportForm.value.toDate,
      //   this.reportForm.value.teamid);
    }
  } // end of moveLast()


  // // display total of elements is on the top-right of the table
  // tooltipSlaDetail(ticketStatusid: number, createTime: Date, lastUpdateDatetime: Date,
  //   currentDatetime: Date, limitTimeToResolve: string, spentDayHhmm: string, sla: string): string {

  //   return this.shareService.tooltipSlaDetail(ticketStatusid, createTime, lastUpdateDatetime, currentDatetime,
  //     limitTimeToResolve, spentDayHhmm, sla);

  // } // end of tooltipSlaDetail()

  secondsToDhms(hours: number): string {

    let seconds = hours*60*60;

    seconds = Number(seconds);
    let d = Math.floor(seconds / (3600*24));
    let h = Math.floor(seconds % (3600*24) / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 60);
    
    let dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    // let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " min " : " mins ") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    // return dDisplay + hDisplay + mDisplay + sDisplay;
    return dDisplay + hDisplay + mDisplay;
    }

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
