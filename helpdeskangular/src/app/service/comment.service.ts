import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ShareService } from './share.service';
import { Observable } from 'rxjs';
import { CommentResponse } from '../payload/CommentResponse';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  // 'http://localhost:8080'
  host = environment.apiUrl;

  // number of teams per page(default = 5)
  pageSize = environment.pageSize;


  constructor(
    private http: HttpClient,
    private shareService: ShareService
  ) { }

  // get all comments by ticket id
  getAllCommentsByTicketid(ticketid: number): Observable<CommentResponse[]> {

    return this.http.get<CommentResponse[]>(
      `${this.shareService.host}/${ticketid}/comments`
    )
  }


  // create a new team
  // public createTicket(ticketCreateRequest: TicketCreateRequest): Observable<CustomHttpResponse> {
  //   return this.http.post<CustomHttpResponse>(`${this.host}/ticket-create`, ticketCreateRequest);
  // }



} // end of class TicketService