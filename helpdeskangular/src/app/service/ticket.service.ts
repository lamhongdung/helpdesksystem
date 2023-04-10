import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DropdownResponse } from '../entity/DropdownResponse';
import { Ticket } from '../entity/Ticket';
import { SearchTicketResponse } from '../entity/SearchTicketResponse';
import { ShareService } from './share.service';
import { CustomHttpRespone } from '../entity/CustomHttpRespone';

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
    ticketStatusid: string): Observable<SearchTicketResponse[]> {

    // console.log(`${this.shareService.host}/ticket-search?userid=${userid}&pageNumber=${pageNumber}&pageSize=${this.shareService.pageSize}&searchTerm=${searchTerm}&fromDate=${fromDate}&toDate=${toDate}&categoryid=${categoryid}&priorityid=${priorityid}&creatorid=${creatorid}&teamid=${teamid}&assigneeid=${assigneeid}&sla=${sla}&ticketStatusid=${ticketStatusid}`);
    return this.http.get<SearchTicketResponse[]>(

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

  // create a new team
  public createTicket(ticket: Ticket): Observable<CustomHttpRespone> {
    return this.http.post<CustomHttpRespone>(`${this.host}/ticket-create`, ticket);
  }

   // edit an existing ticket
   public editTicket(ticket: Ticket): Observable<CustomHttpRespone> {
     return this.http.put<CustomHttpRespone>(`${this.host}/ticket-edit`, ticket);
   }

   // find team by id
   findById(id: number): Observable<Ticket> {
     return this.http.get<Ticket>(`${this.host}/ticket-list/${id}`);
   }

} // end of class TicketService
