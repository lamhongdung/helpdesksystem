import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ShareService } from './share.service';
import { WorkloadReportResponse } from '../payload/WorkloadReportReponse';
import { Observable } from 'rxjs';
import { DropdownResponse } from '../payload/DropdownResponse';
import { SlaReportDetail } from '../payload/SlaReportDetail';
import { SlaReportHeader } from '../payload/SlaReportHeader';
import { Last7DaysReportResponse } from '../payload/Last7DaysReportResponse';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  // 'http://localhost:8080'
  host = environment.apiUrl;

  // number of records per page(default = 5)
  pageSize = environment.pageSize;


  constructor(
    private http: HttpClient,
    private shareService: ShareService
  ) { }

  //
  // 'Workload report'
  //

  // view 'workload report' by page and based on the filter criteria
  viewWorkloadReport(pageNumber: number, fromDate: string, toDate: string, teamid: string, supporterid: string):
    Observable<WorkloadReportResponse[]> {

    return this.http.get<WorkloadReportResponse[]>(

      `${this.shareService.host}/report-workload?pageNumber=${pageNumber}&pageSize=${this.shareService.pageSize}&fromDate=${fromDate}&toDate=${toDate}&teamid=${teamid}&supporterid=${supporterid}`
    )

  } // end of viewWorkloadReport()

  // calculate total of records for counting total pages
  getTotalOfWorkloads(fromDate: string, toDate: string, teamid: string, supporterid: string):
    Observable<number> {

    return this.http.get<number>(
      `${this.shareService.host}/total-of-workloads?fromDate=${fromDate}&toDate=${toDate}&teamid=${teamid}&supporterid=${supporterid}`
    );

  } // end of getTotalOfWorkloads()


  // get active teams + 1 dummy
  getTeams(status: number): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/team-status?status=${status}`
    )

  } // end of getTeams()

  // get all supporters + 1 dummy
  getSupporters(status: number): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/user-supporter-status?status=${status}`
    )

  } // end of getSupporters()

  //
  // 'SLA report'
  //


  // get number of tickets between fromDate and toDate by user id and based on
  // team filter and group by [priority, team]
  viewSlaReportDetail(userid: number, pageNumber: number, fromDate: string, toDate: string, teamid: string):
    Observable<SlaReportDetail[]> {

    return this.http.get<SlaReportDetail[]>(

      `${this.shareService.host}/report-sla-detail?userid=${userid}&pageNumber=${pageNumber}&pageSize=${this.shareService.pageSize}&fromDate=${fromDate}&toDate=${toDate}&teamid=${teamid}`
    )

  } // end of viewSlaReportDetail()

  // get 'total of tickets', 'total of ontime tickets', 'total of lated tickets' and SLA percentage
  // by user id and based on filter criteria[fromDate, toDate, team]
  viewSlaReportHeader(userid: number, fromDate: string, toDate: string, teamid: string):
    Observable<SlaReportHeader> {

    // console.log(`${this.shareService.host}/report-sla-header?userid=${userid}&fromDate=${fromDate}&toDate=${toDate}&teamid=${teamid}`);

    return this.http.get<SlaReportHeader>(

      `${this.shareService.host}/report-sla-header?userid=${userid}&fromDate=${fromDate}&toDate=${toDate}&teamid=${teamid}`
    )

  } // end of viewSlaReportHeader()

  // count total of SLA records by user id and based on filter criteria[team] for pagination.
  getTotalOfSla(userid: number, fromDate: string, toDate: string, teamid: string):
    Observable<number> {

    return this.http.get<number>(
      `${this.shareService.host}/total-of-sla?userid=${userid}&fromDate=${fromDate}&toDate=${toDate}&teamid=${teamid}`
    );

  } // end of getTotalOfSla()

  // get 'total of tickets', 'total of ontime tickets', 'total of lated tickets' and SLA percentage
  // by user id and based on filter criteria[fromDate, toDate, team]
  viewLast7DaysReport(userid: number, reportDate: string):
    Observable<Last7DaysReportResponse[]> {

    // console.log(`${this.shareService.host}/report-sla-header?userid=${userid}&fromDate=${fromDate}&toDate=${toDate}&teamid=${teamid}`);

    return this.http.get<Last7DaysReportResponse[]>(

      `${this.shareService.host}/report-last7days?userid=${userid}&reportDate=${reportDate}`
    )

  } // end of viewLast7DaysReport()

} // end of class ReportService
