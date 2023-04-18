import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ShareService } from './share.service';
import { WorkloadReportResponse } from '../payload/WorkloadReportReponse';
import { Observable } from 'rxjs';
import { DropdownResponse } from '../payload/DropdownResponse';

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

  // view report by page and based on the filter criteria
  viewReport(pageNumber: number, fromDate: string, toDate: string, teamid: string, supporterid: string):
    Observable<WorkloadReportResponse[]> {

    return this.http.get<WorkloadReportResponse[]>(

      `${this.shareService.host}/report-workload?pageNumber=${pageNumber}&pageSize=${this.shareService.pageSize}&fromDate=${fromDate}&toDate=${toDate}&teamid=${teamid}&supporterid=${supporterid}`
    )

  } // end of viewReport()

  // calculate total of records for counting total pages
  getTotalOfWorkloads(fromDate: string, toDate: string, teamid: string, supporterid: string):
    Observable<number> {

    // ex: http://localhost:8080/total-of-tickets?userid=20&searchTerm=&fromDate=2023-01-01&toDate=2023-03-28&categoryid=0&priorityid=0&creatorid=0&teamid=0&assigneeid=0&sla=&ticketStatusid=0
    return this.http.get<number>(
      `${this.shareService.host}/total-of-workloads?fromDate=${fromDate}&toDate=${toDate}&teamid=${teamid}&supporterid=${supporterid}`
    );

  } // end of getTotalOfWorkloads()


  // get all teams + 1 dummy
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


} // end of class ReportService
