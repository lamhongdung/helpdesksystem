import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Calendar } from 'src/app/entity/Calendar';
import { CalendarService } from 'src/app/service/calendar.service';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.css']
})
export class CalendarListComponent {

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // current page
  currentPage: number = 1;
  // total pages
  totalPages: number;
  // total of calendars(for pagination)
  totalOfCalendars: number;
  // calendar list(the grid of the calendar table)
  calendars: Calendar[] = [];
  // number of calendars per page(default = 5)
  pageSize: number;

  // form of "Search calendar"
  searchCalendar = this.formBuilder.group({

    // search term
    searchTerm: [''],
    // status
    status: [''],

  });


  constructor(private calendarService: CalendarService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  // this method ngOnInit() is run right after the contructor
  ngOnInit(): void {

    // initial page size(default = 5)
    this.pageSize = this.calendarService.pageSize;

    // initial current page(in the front end)
    this.currentPage = 1;

    // assign calendars from database to the this.calendars variable, and get totalPages.
    // the first parameter(page) = 0: in MySQL 0 means the first page.
    this.searchCalendars(0, this.searchCalendar.value.searchTerm, this.searchCalendar.value.status);

  } // end of ngOnInit()

  // get calendars, total of calendars and total pages
  searchCalendars(pageNumber: number, searchTerm: string, status: string) {

    // push to list of subscriptions for easily unsubscribes all subscriptions of the CalendarListComponent
    this.subscriptions.push(

      // get calendars
      this.calendarService.searchCalendars(pageNumber, searchTerm, status)

        .subscribe({
          next: (data: Calendar[]) => {
            return this.calendars = data
          }
        })
    );

    // push to list of subscriptions for easily unsubscribes all subscriptions of the CalendarListComponent
    this.subscriptions.push(

      // get total of calendars and total pages
      this.calendarService.getTotalOfCalendars(searchTerm, status)

        .subscribe({
          next: (data: number) => {
            // total of calendars
            this.totalOfCalendars = data;
            // total pages
            this.totalPages = this.calculateTotalPages(this.totalOfCalendars, this.pageSize);
          }
        })
    )
  } // end of searchCalendars()

  // calculate total pages for pagination
  calculateTotalPages(totalOfCalendars: number, pageSize: number): number {

    if ((totalOfCalendars % pageSize) != 0) {
      //  Math.floor: rounds down and returns the largest integer less than or equal to a given number
      return (Math.floor(totalOfCalendars / pageSize)) + 1;
    }

    return totalOfCalendars / pageSize;

  } // end of calculateTotalPages()

  // count index for current page
  // ex:  page 1: ord 1 --> ord 5
  //      page 2: ord 6 --> ord 10 (not repeat: ord 1 --> ord 5)
  // parameters:
  //  - currentPage: current page
  //  - index: running variable(the index variable of "for loop")
  indexBasedPage(currentPage: number, index: number): number {

    // this.pageSize = 5
    return (this.pageSize * (currentPage - 1)) + (index + 1);
  }

  // go to specific page
  goPage() {

    // if (1 <= currentPage <= totalPages) then go to specific page
    if (this.currentPage >= 1 && this.currentPage <= this.totalPages) {

      // the "nth element" in MySQL
      let nth_element = (this.pageSize) * (this.currentPage - 1);

      // get calendars, total of calendars and total of pages
      this.searchCalendars(nth_element, this.searchCalendar.value.searchTerm, this.searchCalendar.value.status);
    }

  }

  // user changes page number in the text box
  changePageNumber(value: number) {
    this.currentPage = value;
  }

  // move to the first page
  moveFirst() {

    // if current page is not the first page
    if (this.currentPage > 1) {

      this.currentPage = 1;

      // the "nth element" in MySQL
      let nth_element = (this.pageSize) * (this.currentPage - 1);

      // get calendars, total of calendars and total pages
      this.searchCalendars(nth_element, this.searchCalendar.value.searchTerm, this.searchCalendar.value.status);
    }

  }

  // move to the next page
  moveNext() {

    // if current page is not the last page
    if (this.currentPage < this.totalPages) {

      this.currentPage = this.currentPage + 1;

      // the "nth element" in MySQL
      let nth_element = (this.pageSize) * (this.currentPage - 1);

      // get calendars, total of calendars and total pages
      this.searchCalendars(nth_element, this.searchCalendar.value.searchTerm, this.searchCalendar.value.status);
    }

  }

  // move to the previous page
  movePrevious() {

    // if current page is not the first page
    if (this.currentPage > 1) {

      this.currentPage = this.currentPage - 1;

      // the "nth element" in MySQL
      let nth_element = (this.pageSize) * (this.currentPage - 1);

      // get calendars, total of calendars and total pages
      this.searchCalendars(nth_element, this.searchCalendar.value.searchTerm, this.searchCalendar.value.status);
    }

  }

  // move to the last page
  moveLast() {

    // if current page is not the last page
    if (this.currentPage < this.totalPages) {

      this.currentPage = this.totalPages;

      // the "nth element" in MySQL
      let nth_element = (this.pageSize) * (this.currentPage - 1);

      // get calendars, total of calendars and total pages
      this.searchCalendars(nth_element, this.searchCalendar.value.searchTerm, this.searchCalendar.value.status);
    }
  }

  // view specific calendar by id
  viewCalendar(id: number) {
    this.router.navigate(['/calendar-view', id]);
  }

  // unsubscribe all subscriptions from this component "CalendarListComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

