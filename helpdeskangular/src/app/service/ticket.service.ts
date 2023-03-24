import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DropdownResponse } from '../entity/DropdownResponse';
import { Ticket } from '../entity/Ticket';
import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  //  // 'http://localhost:8080'
  //  host = environment.apiUrl;

  //  // number of teams per page(default = 5)
  //  pageSize = environment.pageSize;

  constructor(private http: HttpClient,
    private shareService: ShareService
  ) { }

  // get teams by page and based on the search criteria
  searchTickets(pageNumber: number, searchTerm: string,
    assignmentMethod: string, status: string): Observable<Ticket[]> {

    // ex: url = http://localhost:8080/team-search?pageNumber=0&pageSize=5&searchTerm=""&assignmentMethod=""&status=""
    // return this.http.get<TeamResponse[]>(
    //   `${this.host}/team-search?pageNumber=${pageNumber}&pageSize=${this.pageSize}&searchTerm=${searchTerm}&assignmentMethod=${assignmentMethod}&status=${status}`
    // )
    return this.http.get<Ticket[]>(
      `${this.shareService.host}/team-search?pageNumber=${pageNumber}&pageSize=${this.shareService.pageSize}&searchTerm=${searchTerm}&assignmentMethod=${assignmentMethod}&status=${status}`
    )
  } // end of searchTeams()

  // calculate total of teams for counting total pages
  getTotalOfTickets(searchTerm: string, assignmentMethod: string, status: string): Observable<number> {

    // ex: http://localhost:8080/total-of-teams?searchTerm=""&assignmentMethod=""&status=""
    return this.http.get<number>(
      `${this.shareService.host}/total-of-tickets?searchTerm=${searchTerm}&assignmentMethod=${assignmentMethod}&status=${status}`
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

  // get all categories
  getAllCategories(): Observable<DropdownResponse[]> {

    // console.log(`${this.host}/active-supporters`);

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/categories`
    )
  }

  // get all priorities
  getAllPriorities(): Observable<DropdownResponse[]> {

    // console.log(`${this.host}/active-supporters`);

    return this.http.get<DropdownResponse[]>(
      `${this.shareService.host}/priorities`
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

} // end of class TeamService
