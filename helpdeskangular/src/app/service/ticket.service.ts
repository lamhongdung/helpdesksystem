import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DropdownResponse } from '../entity/DropdownResponse';
import { Ticket } from '../entity/Ticket';
import { TicketResponse } from '../entity/TicketResponse';
import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient,
    private shareService: ShareService
  ) { }

  // get tickets by userid(and by user role), by page and based on the search criteria
  searchTickets(userid: number, pageNumber: number, searchTerm: string): Observable<TicketResponse[]> {

    // ex: url = http://localhost:8080/team-search?pageNumber=0&pageSize=5&searchTerm=""&assignmentMethod=""&status=""
    // return this.http.get<TeamResponse[]>(
    //   `${this.host}/team-search?pageNumber=${pageNumber}&pageSize=${this.pageSize}&searchTerm=${searchTerm}&assignmentMethod=${assignmentMethod}&status=${status}`
    // )
    return this.http.get<TicketResponse[]>(
      `${this.shareService.host}/ticket-search?userid=${userid}&pageNumber=${pageNumber}&pageSize=${this.shareService.pageSize}&searchTerm=${searchTerm}`
    )
  } // end of searchTeams()

  // calculate total of teams for counting total pages
  getTotalOfTickets(userid: number, searchTerm: string): Observable<number> {

    // ex: http://localhost:8080/total-of-teams?searchTerm=""&assignmentMethod=""&status=""
    return this.http.get<number>(
      `${this.shareService.host}/total-of-tickets?userid=${userid}&searchTerm=${searchTerm}`
    );

  } // end of getTotalOfTeams()

  // get all ticket status
  getAllTicketStatus(): Observable<DropdownResponse[]> {

    // console.log(`${this.host}/active-supporters`);

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/ticketStatus`
    )
  }

  // get creators by userid(and by user role)
  getCreatorsByUserid(userid: number): Observable<DropdownResponse[]> {

    // console.log(`${this.host}/active-supporters`);

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/creators?userid=${userid}`
    )
  }

  // get teams by userid(and by user role)
  getTeamsByUserid(userid: number): Observable<DropdownResponse[]> {

    // console.log(`${this.host}/active-supporters`);

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/teams?userid=${userid}`
    )
  }

  // get assignees by userid(and by user role)
  getAssigneesByUserid(userid: number): Observable<DropdownResponse[]> {

    // console.log(`${this.host}/active-supporters`);

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/assignees?userid=${userid}`
    )
  }

  // get categories by userid(and by user role)
  getCategoriesByUserid(userid: number): Observable<DropdownResponse[]> {

    // console.log(`${this.host}/active-supporters`);

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/categories?userid=${userid}`
    )
  }

  // get priorities by userid(and by user role)
  getPrioritiesByUserid(userid: number): Observable<DropdownResponse[]> {

    // console.log(`${this.host}/active-supporters`);

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

} // end of class Ticketervice
