import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DropdownResponse } from '../payload/DropdownResponse';
// import { Supporter } from '../entity/Supporter';
import { Team } from '../payload/Team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  // 'http://localhost:8080'
  host = environment.apiUrl;

  // number of teams per page(default = 5)
  pageSize = environment.pageSize;

  constructor(private http: HttpClient) { }

  // get teams by page and based on the search criteria
  searchTeams(pageNumber: number, searchTerm: string, 
    assignmentMethod: string, status: string): Observable<Team[]> {

    // ex: url = http://localhost:8080/team-search?pageNumber=0&pageSize=5&searchTerm=""&assignmentMethod=""&status=""
    // return this.http.get<TeamResponse[]>(
    //   `${this.host}/team-search?pageNumber=${pageNumber}&pageSize=${this.pageSize}&searchTerm=${searchTerm}&assignmentMethod=${assignmentMethod}&status=${status}`
    // )
    return this.http.get<Team[]>(
      `${this.host}/team-search?pageNumber=${pageNumber}&pageSize=${this.pageSize}&searchTerm=${searchTerm}&assignmentMethod=${assignmentMethod}&status=${status}`
    )
  } // end of searchTeams()

  // calculate total of teams for counting total pages
  getTotalOfTeams(searchTerm: string, assignmentMethod: string, status: string): Observable<number> {

    // ex: http://localhost:8080/total-of-teams?searchTerm=""&assignmentMethod=""&status=""
    return this.http.get<number>(
      `${this.host}/total-of-teams?searchTerm=${searchTerm}&assignmentMethod=${assignmentMethod}&status=${status}`
    );

  } // end of getTotalOfTeams()

  // get all active supporters
  getActiveSupporters(): Observable<DropdownResponse[]> {

    // console.log(`${this.host}/active-supporters`);

    return this.http.get<DropdownResponse[]>(
      `${this.host}/active-supporters`
    )
  }

  // create a new team
  public createTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(`${this.host}/team-create`, team);
  }

  // edit an existing team
  public editTeam(team: Team): Observable<Team> {
    return this.http.put<Team>(`${this.host}/team-edit`, team);
  }

  // find team by id
  findById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.host}/team-list/${id}`);
  }

} // end of class TeamService