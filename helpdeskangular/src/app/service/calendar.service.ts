// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
// // import { Calendar } from '../entity/Calendar';

// @Injectable({
//   providedIn: 'root'
// })
// export class CalendarService {

//   // 'http://localhost:8080'
//   host = environment.apiUrl;

//   // number of calendars per page(default = 5)
//   pageSize = environment.pageSize;

//   constructor(private http: HttpClient) { }

//   // get calendars by page and based on the search criteria
//   searchCalendars(pageNumber: number, searchTerm: string, status: string): Observable<Calendar[]> {

//     // ex: url = http://localhost:8080/calendar-search?pageNumber=0&pageSize=5&searchTerm=""&status=""
//     return this.http.get<Calendar[]>(
//       `${this.host}/calendar-search?pageNumber=${pageNumber}&pageSize=${this.pageSize}&searchTerm=${searchTerm}&status=${status}`
//     )
//   }

//   // calculate total of calendars for count total pages
//   getTotalOfCalendars(searchTerm: string, status: string): Observable<number> {

//     // ex: http://localhost:8080/total-of-calendars?searchTerm=""&status=""
//     return this.http.get<number>(
//       `${this.host}/total-of-calendars?searchTerm=${searchTerm}&status=${status}`
//     );

//   }

//   // get all calendars
//   getAllCalendars(status: string): Observable<Calendar[]> {

//     // ex: url1 = http://localhost:8080/calendars?status=""
//     // ex: url2= http://localhost:8080/calendars?status="Active"
//     // ex: url3= http://localhost:8080/calendars?status="Inactive"
//     return this.http.get<Calendar[]>(
//       `${this.host}/calendars?status=${status}`
//     )
//   }

//   // create new calendar
//   public createCalendar(calendar: Calendar): Observable<Calendar> {
//     return this.http.post<Calendar>(`${this.host}/calendar-create`, calendar);
//   }

//   // edit existing calendar
//   public editCalendar(calendar: Calendar): Observable<Calendar> {
//     return this.http.put<Calendar>(`${this.host}/calendar-edit`, calendar);
//   }

//   // find calendar by id
//   findById(id: number): Observable<Calendar> {
//     return this.http.get<Calendar>(`${this.host}/calendar-list/${id}`);
//   }

// }
