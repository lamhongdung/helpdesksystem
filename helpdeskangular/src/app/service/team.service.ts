import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Supporter } from '../entity/Supporter';
import { TeamRequest } from '../entity/TeamRequest';
import { TeamResponse } from '../entity/TeamResponse';

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
  searchTeams(pageNumber: number, searchTerm: string, assignmentMethod: string, status: string): Observable<TeamResponse[]> {

    // ex: url = http://localhost:8080/team-search?pageNumber=0&pageSize=5&searchTerm=""&assignmentMethod=""&status=""
    return this.http.get<TeamResponse[]>(
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
  getActiveSupporters(): Observable<Supporter[]> {

    // console.log(`${this.host}/active-supporters`);

    return this.http.get<Supporter[]>(
      `${this.host}/active-supporters`
    )
  }

  // create new team
  public createTeam(team: TeamRequest): Observable<TeamRequest> {
    return this.http.post<TeamRequest>(`${this.host}/team-create`, team);
  }

  // edit existing team
  public editTeam(team: TeamRequest): Observable<TeamRequest> {
    return this.http.put<TeamRequest>(`${this.host}/team-edit`, team);
  }

  // find team by id
  findById(id: number): Observable<TeamRequest> {
    return this.http.get<TeamRequest>(`${this.host}/team-list/${id}`);
  }

} // end of class TeamService