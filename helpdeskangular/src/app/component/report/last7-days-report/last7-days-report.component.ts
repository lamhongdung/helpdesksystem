import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ChartData, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { Last7DaysReportResponse } from 'src/app/payload/Last7DaysReportResponse';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ReportService } from 'src/app/service/report.service';
import { ShareService } from 'src/app/service/share.service';

@Component({
  selector: 'app-last7-days-report',
  templateUrl: './last7-days-report.component.html',
  styleUrls: ['./last7-days-report.component.css']
})
export class Last7DaysReportComponent {

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // user who logged in the system
  userid: number;

  // current date(ex: Vietnam local time).
  // ex: Vietname time: 10:08 a.m, 21-Mar-2023
  // => new Date() = Tue Mar 21 2023 10:08:29 GMT+0700 (Indochina Time)
  currentDate = new Date();

  // reportDate = current date(local time) in format "yyyy-MM-dd".
  // in case reportDate = '' then system will consider this reportDate as current date.
  reportDate = formatDate(this.currentDate.toLocaleString(), "yyyy-MM-dd", "en-US");

  // total of new tickets last 7 days by user id and user role
  totalOfNewTickets: number = 0;
  // total of solved tickets last 7 days by user id and user role
  totalOfSolvedTickets: number = 0;
  // total of closed tickets last 7 days by user id and user role
  totalOfClosedTickets: number = 0;
  // total spent hours for 'Resolved'/'Closed' tickets
  totalSpentHourOfSolvedClosed: number = 0;
  // average spent time for 'Resolved'/'Closed' tickets
  avgSolvedHour: number = 0;

  // tooltips:
  // ex:  tooltips.set('key', 'value');
  //      tooltips.get('key') --> return 'value';
  tooltips = new Map<string, string>();

  // the "reportForm"(filter form)
  reportForm = this.formBuilder.group({

    // current date
    reportDate: ['']

  });

  //
  // 'new tickets' chart
  //

  // labels at bottom of chart
  labels: string[] = [];
  // array of new ticket values
  newTickets: number[] = [];

  // initail chart
  last7DaysData: ChartData<'bar'> = {

    // labels at bottom of chart
    labels: [],

    datasets: [

      // - label: lable right below chart title
      // - data: data of chart
      { label: '', data: [] }

    ],
  };

  chartOptions: ChartOptions = {

    responsive: true,

    // set = false to customize height and width of chart
    maintainAspectRatio: false,

    plugins: {
      title: {
        // do not display title of chart
        display: false,
        // chart title
        text: 'Last 7 days report',
      },
    },
  }

  constructor(
    private reportService: ReportService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {

    // reportDate = current date(local)
    this.reportForm.controls['reportDate'].setValue(this.reportDate);

  }

  // this method ngOnInit() is run right after the contructor
  ngOnInit(): void {

    // user id who has logged in the system.
    // the '+' sign means convert string to number
    this.userid = +this.authService.getIdFromLocalStorage();

    // tooltips
    this.loadTooltip();

    // get data from database for show 'Last 7 days report' .
    this.viewReport(this.userid, this.reportForm.value.reportDate);

  } // end of ngOnInit()


  // view report based on user id and reportDate
  viewReport(userid: number, reportDate: string) {

    // push to list of subscriptions for easily unsubscribes all subscriptions of the Last7DaysReportComponent
    this.subscriptions.push(

      //
      // get 'Last 7 days report'
      //
      this.reportService.viewLast7DaysReport(userid, reportDate)

        .subscribe({

          // get 'Last 7 days report' from database successful.
          next: (data: Last7DaysReportResponse[]) => {

            // clear array 'labels'
            this.labels.splice(0);
            // clear array 'newTickets'
            this.newTickets.splice(0);

            // reset value of totalOfNewTickets
            this.totalOfNewTickets = 0;
            // reset value of totalOfSolvedTickets
            this.totalOfSolvedTickets = 0;
            // reset value of totalOfClosedTickets
            this.totalOfClosedTickets = 0;
            // reset value of totalSpentHourOfSolvedClosed
            this.totalSpentHourOfSolvedClosed = 0;
            // reset value of avgSolvedTime
            this.avgSolvedHour = 0;

            data.forEach(item => {

              // labels at bottom of chart
              this.labels.push(item.dayMonth);
              // chart data
              this.newTickets.push(item.numOfNewTickets);

              // summary values
              this.totalOfNewTickets = this.totalOfNewTickets + item.numOfNewTickets;
              this.totalOfSolvedTickets = this.totalOfSolvedTickets + item.numOfSolvedTickets;
              this.totalOfClosedTickets = this.totalOfClosedTickets + item.numOfClosedTickets;
              this.totalSpentHourOfSolvedClosed = this.totalSpentHourOfSolvedClosed + item.totalSpentHour;

            })

            // avoid error of 'divided by zero'
            if (this.totalOfSolvedTickets + this.totalOfClosedTickets == 0) {

              this.avgSolvedHour = 0;

            } else {

              // average solved hours
              this.avgSolvedHour = (this.totalSpentHourOfSolvedClosed * 1.0) / (this.totalOfSolvedTickets + this.totalOfClosedTickets);

            }

            // set data for chart
            this.last7DaysData = {

              // labels at bottom of chart
              labels: this.labels,

              datasets: [
                {
                  // label right below chart title
                  label: "New tickets",

                  // data of chart bar
                  data: this.newTickets

                }
              ]
            }
          },

          // there are some errors when get 'Last 7 days report' from database
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }

        })
    ); // end of this.subscriptions.push()

  } // end of viewReport()

  // load tooltips
  loadTooltip() {

    //
    // tooltips
    //

    this.tooltips.set("reportDate", "- Report date(mm/dd/yyyy).<br>- Default value is current date.<br>- In case user lets this field blank then system will set it as current date");
    this.tooltips.set("viewButton", "View report");

  } // end of loadTooltip()

  // display average solved time in 'x days y hours z minutes'
  displayAvgSolvedTime(avgHours: number): string {

    let seconds = avgHours * 60 * 60;

    // day
    let d = Math.floor(seconds / (3600 * 24));
    // hours
    let h = Math.floor(seconds % (3600 * 24) / 3600);
    // minutes
    let m = Math.floor(seconds % 3600 / 60);

    // display 'days' part
    let dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    // display 'hours' part
    let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    // display 'minutes' part
    let mDisplay = m > 0 ? m + (m == 1 ? " min " : " mins ") : "";

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
