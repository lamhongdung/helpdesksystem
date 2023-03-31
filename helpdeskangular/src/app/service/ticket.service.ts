import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DropdownResponse } from '../entity/DropdownResponse';
import { TicketResponse } from '../entity/TicketResponse';
import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient,
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
    ticketStatusid: string): Observable<TicketResponse[]> {

    // ex: url = http://localhost:8080/ticket-search?userid=1&pageNumber=0&pageSize=5&searchTerm=&fromDate=2023-01-01&toDate=2023-03-26&categoryid=0&priorityid=0&creatorid=1&teamid=0&assigneeid=0&sla=&ticketStatusid=0
    // return this.http.get<TicketResponse[]>(
    //   `${this.shareService.host}/ticket-search?userid=${userid}&pageNumber=${pageNumber}&pageSize=${this.shareService.pageSize}&searchTerm=${searchTerm}&fromDate=${fromDate}&toDate=${toDate}&categoryid=${categoryid}&priorityid=${priorityid}&creatorid=${creatorid}&teamid=${teamid}&assigneeid=${assigneeid}&sla=${sla}&ticketStatusid=${ticketStatusid}`
    // )

    // console.log(`${this.shareService.host}/ticket-search?userid=${userid}&pageNumber=${pageNumber}&pageSize=${this.shareService.pageSize}&searchTerm=${searchTerm}&fromDate=${fromDate}&toDate=${toDate}&categoryid=${categoryid}&priorityid=${priorityid}&creatorid=${creatorid}&teamid=${teamid}&assigneeid=${assigneeid}&sla=${sla}&ticketStatusid=${ticketStatusid}`);
    return this.http.get<TicketResponse[]>(
      
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

  // get teams by userid(and by user role)
  getTeamsByUserid(userid: number): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/teams?userid=${userid}`
    )
  }

  // get assignees by userid(and by user role)
  getAssigneesByUserid(userid: number): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/assignees?userid=${userid}`
    )
  }

  // get categories by userid(and by user role)
  getCategoriesByUserid(userid: number): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/categories?userid=${userid}`
    )
  }

  // get priorities by userid(and by user role)
  getPrioritiesByUserid(userid: number): Observable<DropdownResponse[]> {

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/priorities?userid=${userid}`
    )
  }



  //  // create a new team
  //  public createTeam(team: Team): Observable<Team> {
  //    return this.http.post<Team>(`${this.host}/team-create`, team);
  //  }

  //  // edit an existing team
  //  public editTeam(team: Team): Observable<Team> {
  //    return this.http.put<Team>(`${this.host}/team-edit`, team);
  //  }

  //  // find team by id
  //  findById(id: number): Observable<Team> {
  //    return this.http.get<Team>(`${this.host}/team-list/${id}`);
  //  }

} // end of class TicketService
