import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Priority } from '../entity/Priority';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {


  // 'http://localhost:8080'
  host = environment.apiUrl;

  // number of priorities per page(default = 5)
  pageSize = environment.pageSize;

  constructor(private http: HttpClient) { }

  // get priorities by page and based on the search criteria
  // parameters:
  //  - pageNumber: page number
  //  - searchTerm: search term(ID, name)
  //  - resolveInOpt: gt(>=), eq(=), lt(<=)
  //  - resolveIn: number of hours to complete a ticket
  //  - status: '', 'Active', 'Inactive'  
  searchPriorities(pageNumber: number, searchTerm: string,
    resolveInOpt: string, resolveIn: number, status: string): Observable<Priority[]> {

    // console.log(`${this.host}/priority-search?pageNumber=${pageNumber}&pageSize=${this.pageSize}&searchTerm=${searchTerm}&resolveInOpt=${resolveInOpt}&resolveIn=${resolveIn}&status=${status}`);

    // ex: url = http://localhost:8080/priority-search?pageNumber=0&pageSize=5&searchTerm=""&resolveInOpt="gt"&resolveIn=0&status=""
    return this.http.get<Priority[]>(
      `${this.host}/priority-search?pageNumber=${pageNumber}&pageSize=${this.pageSize}&searchTerm=${searchTerm}&resolveInOpt=${resolveInOpt}&resolveIn=${resolveIn}&status=${status}`
    )
  }

  // calculate total of priorities for count total pages
  // parameters:
  //  - searchTerm: search term(ID, name)
  //  - resolveInOpt: gt(>=), eq(=), lt(<=)
  //  - resolveIn: number of hours to complete a ticket
  //  - status: '', 'Active', 'Inactive'
  getTotalOfPriorities(searchTerm: string, resolveInOpt: string, resolveIn: number, status: string): Observable<number> {

    // ex: http://localhost:8080/total-of-priorities?searchTerm=""&resolveInOpt="gt"&resolveIn=0&status=""
    return this.http.get<number>(
      `${this.host}/total-of-priorities?searchTerm=${searchTerm}&resolveInOpt=${resolveInOpt}&resolveIn=${resolveIn}&status=${status}`
    );

  } // end of getTotalOfPriorities()

  // create new priority
  public createPriority(priority: Priority): Observable<Priority> {
    return this.http.post<Priority>(`${this.host}/priority-create`, priority);
  }

  // edit existing priority
  public editPriority(priority: Priority): Observable<Priority> {
    return this.http.put<Priority>(`${this.host}/priority-edit`, priority);
  }

  // find priority by id
  findById(id: number): Observable<Priority> {
    return this.http.get<Priority>(`${this.host}/priority-list/${id}`);
  }

}