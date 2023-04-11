import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DropdownResponse } from '../payload/DropdownResponse';
import { TicketSearchResponse } from '../payload/TicketSearchResponse';
import { ShareService } from './share.service';
import { CustomHttpRespone } from '../payload/CustomHttpRespone';
import { TicketCreateRequest } from '../payload/TicketCreateRequest';
import { TicketEditViewResponse } from '../payload/TicketEditViewResponse';
import { TicketEditRequest } from '../payload/TicketEditRequest';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  // 'http://localhost:8080'
  host = environment.apiUrl;

  // number of teams per page(default = 5)
  pageSize = environment.pageSize;


  constructor(
    private http: HttpClient,
    private shareService: ShareService
  ) { }

  // search tickets by userid(and by user role), by page and based on the search criteria
  searchTickets(
    userid: number,
    pageNumber: number,
    searchTerm: string,
    fromDate: string,
    toDate: string,
    categoryid: string,
    priorityid: string,
    creatorid: string,
    teamid: string,
    assigneeid: string,
    sla: string,
    ticketStatusid: string): Observable<TicketSearchResponse[]> {

    // console.log(`${this.shareService.host}/ticket-search?userid=${userid}&pageNumber=${pageNumber}&pageSize=${this.shareService.pageSize}&searchTerm=${searchTerm}&fromDate=${fromDate}&toDate=${toDate}&categoryid=${categoryid}&priorityid=${priorityid}&creatorid=${creatorid}&teamid=${teamid}&assigneeid=${assigneeid}&sla=${sla}&ticketStatusid=${ticketStatusid}`);
    return this.http.get<TicketSearchResponse[]>(

      `${this.shareService.host}/ticket-search?userid=${userid}&pageNumber=${pageNumber}&pageSize=${this.shareService.pageSize}&searchTerm=${searchTerm}&fromDate=${fromDate}&toDate=${toDate}&categoryid=${categoryid}&priorityid=${priorityid}&creatorid=${creatorid}&teamid=${teamid}&assigneeid=${assigneeid}&sla=${sla}&ticketStatusid=${ticketStatusid}`
    )

  } // end of searchTickets()

  // calculate total of tickets for counting total pages
  getTotalOfTickets(
    userid: number,
    searchTerm: string,
    fromDate: string,
    toDate: string,
    categoryid: string,
    priorityid: string,
    creatorid: string,
    teamid: string,
    assigneeid: string,
    sla: string,
    ticketStatusid: string): Observable<number> {

    // ex: http://localhost:8080/total-of-tickets?userid=20&searchTerm=&fromDate=2023-01-01&toDate=2023-03-28&categoryid=0&priorityid=0&creatorid=0&teamid=0&assigneeid=0&sla=&ticketStatusid=0
    return this.http.get<number>(
      `${this.shareService.host}/total-of-tickets?userid=${userid}&searchTerm=${searchTerm}&fromDate=${fromDate}&toDate=${toDate}&categoryid=${categoryid}&priorityid=${priorityid}&creatorid=${creatorid}&teamid=${teamid}&assigneeid=${assigneeid}&sla=${sla}&ticketStatusid=${ticketStatusid}`
    );

  } // end of getTotalOfTickets()

  // get all ticket status
  getAllTicketStatus(): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/ticketStatus`
    )
  }

  // get creators by userid(and by user role)
  getCreatorsByUserid(userid: number): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/creators?userid=${userid}`
    )
  }

  // get categories by userid(and by user role)
  getCategoriesByUserid(userid: number): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/categories?userid=${userid}`
    )
  }

  // get all active categories
  getAllActiveCategories(): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/active-categories`
    )
  }

  // get teams by userid(and by user role)
  getTeamsByUserid(userid: number): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/teams?userid=${userid}`
    )
  }

  // get all active teams
  getAllActiveTeams(): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/active-teams`
    )
  }

  // get assignees by userid(and by user role)
  getAssigneesByUserid(userid: number): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/assignees?userid=${userid}`
    )
  }

  // get priorities by userid(and by user role)
  getPrioritiesByUserid(userid: number): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/priorities?userid=${userid}`
    )
  }

  // get all active priorities
  getAllActivePriorities(): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/active-priorities`
    )
  }

  // get active supporters belong team
  getActiveSupportersBelongTeam(ticketid: number): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/active-supporters-belong-team?ticketid=${ticketid}`
    )
  }

  // get next ticket status
  getNextTicketStatus(ticketid: number): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/next-ticket-status?ticketid=${ticketid}`
    )
  }

  // create a new team
  public createTicket(ticketCreateRequest: TicketCreateRequest): Observable<CustomHttpRespone> {
    return this.http.post<CustomHttpRespone>(`${this.host}/ticket-create`, ticketCreateRequest);
  }

  // edit an existing ticket
  public editTicket(TicketEditRequest: TicketEditRequest): Observable<CustomHttpRespone> {
    return this.http.put<CustomHttpRespone>(`${this.host}/ticket-edit`, TicketEditRequest);
  }

  // find ticket by id
  findById(id: number): Observable<TicketEditViewResponse> {
    return this.http.get<TicketEditViewResponse>(`${this.host}/ticket-list/${id}`);
  }

} // end of class TicketService
