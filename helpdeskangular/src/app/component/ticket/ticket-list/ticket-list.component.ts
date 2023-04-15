import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DropdownResponse } from 'src/app/payload/DropdownResponse';
import { TicketSearchResponse } from 'src/app/payload/TicketSearchResponse';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ShareService } from 'src/app/service/share.service';
import { TicketService } from 'src/app/service/ticket.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent {

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // current page
  currentPage: number = 1;
  // total pages
  totalPages: number;
  // total of tickets(for pagination)
  totalOfTickets: number;

  // ticket list(the grid of the team table)
  searchTicketResponses: TicketSearchResponse[] = [];
  // number of tickets per page(default = 5)
  pageSize: number;

  // user who logged in the system
  userid: number;

  // user role of the logged person in the system
  loggedInRole: string;

  // all ticket status
  allTicketStatus: DropdownResponse[] = [];

  // all creators who have tickets
  creators: DropdownResponse[] = [];

  // all teams that supporter belongs to these teams
  // and these teams have tickets
  teams: DropdownResponse[] = [];

  // assignees who is assigned to resolve the ticket
  assignees: DropdownResponse[] = [];

  // all priorities have tickets
  priorities: DropdownResponse[] = [];

  // all categories have tickets
  categories: DropdownResponse[] = [];

  // current date(ex: Vietnam local).
  // ex: Vietname time: 10:08 a.m , 21-Mar-2023
  // => new Date() = Tue Mar 21 2023 10:08:29 GMT+0700 (Indochina Time)
  currentDate = new Date();

  // first day of current year.
  // note:
  //  - this.currentDate.getFullYear(): current year(yyyy)
  //  - 0: January
  //  - 1: first day
  //  - toLocaleString(): convert to string M/dd/yyyy
  //  - formatDate(...,"yyyy-MM-dd"): convert to format "yyyy-MM-dd"
  firstDayOfCurrentYear = formatDate(new Date(this.currentDate.getFullYear(), 0, 1)
    .toLocaleString(), "yyyy-MM-dd", "en-US");

  // current date(local) in format "yyyy-MM-dd"
  toDate = formatDate(this.currentDate.toLocaleString(), "yyyy-MM-dd", "en-US");

  //
  // tooltips
  //

  // tooltips for "Search form" and "table"
  // ex:  tooltips.set('key', 'value');
  //      tooltips.get('key') --> return 'value';
  tooltips = new Map<string, string>();

  // tooltips for pagination
  tooltipFirstPage: string;
  tooltipPreviousPage: string;
  tooltipCurrentPage: string;
  tooltipTotalPages: string;
  tooltipGoPage: string;
  tooltipNextPage: string;
  tooltipLastPage: string;

  // placeholders.
  // ex:  tooltips.set('key', 'value');
  //      tooltips.get('key') --> return 'value';
  placeholders = new Map<string, string>();

  // the "Search ticket" form
  searchTicket = this.formBuilder.group({

    // search term.
    // if role is "customer" then will search for : ticket id, subject and content.
    // else if role is "supporter" or "admin" then search for: 
    //  ticket id, subject, content, creator phone, creator email
    searchTerm: [''],
    // first day of current year
    fromDate: [''],
    // current date
    toDate: [''],
    // default value = 0(all)
    categoryid: ['0'],
    // default value = 0(all)
    priorityid: ["0"],

    // creator id.
    // default value depends on his role.
    // if role is "customer" then creatorid is him-self
    // else creatorid = 0(all)
    creatorid: ['0'],

    // default value = 0(all)
    teamid: ['0'],
    // default value = 0(all)
    assigneeid: ['0'],
    // SLA(service level agreement).
    // default value = ''(all)
    sla: [''],
    // default values = 0(all)
    ticketStatusid: ['0']

  });


  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private shareService: ShareService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
  ) {

    // fromDate = first day of current year(local).
    this.searchTicket.controls['fromDate'].setValue(this.firstDayOfCurrentYear);

    // toDate = current date(local)
    this.searchTicket.controls['toDate'].setValue(this.toDate);

  }

  // this method ngOnInit() is run right after the contructor
  ngOnInit(): void {

    // initialize page size(default = 5)
    this.pageSize = this.shareService.pageSize;

    // initialize current page(in the front end)
    this.currentPage = 1;

    // user id who has logged in the system.
    // the '+' sign means convert string to number
    this.userid = +this.authService.getIdFromLocalStorage();

    // user role of person has just logged in the sytem
    this.loggedInRole = this.authService.getRoleFromLocalStorage();

    // tooltips and placeholders
    this.loadTooltipPlaceholder();

    // initialize default values for all form controls
    this.loadDropdownValues();

    // assign tickets from database to the this.tickets variable, and get totalPages.
    // the second parameter(page) = 0: in MySQL 0 means the first page.
    this.searchTickets(
      this.userid,
      0,
      this.searchTicket.value.searchTerm,
      this.searchTicket.value.fromDate,
      this.searchTicket.value.toDate,
      this.searchTicket.value.categoryid,
      this.searchTicket.value.priorityid,
      this.searchTicket.value.creatorid,
      this.searchTicket.value.teamid,
      this.searchTicket.value.assigneeid,
      this.searchTicket.value.sla,
      this.searchTicket.value.ticketStatusid);

  } // end of ngOnInit()


  // search tickets based on user id and search criteria
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
    ticketStatusid: string) {

    // push to list of subscriptions for easily unsubscribes all subscriptions of the TicketListComponent
    this.subscriptions.push(

      //
      // get tickets
      //
      this.ticketService.searchTickets(
        userid,
        pageNumber,
        searchTerm,
        fromDate,
        toDate,
        categoryid,
        priorityid,
        creatorid,
        teamid,
        assigneeid,
        sla,
        ticketStatusid)

        .subscribe({

          // get tickets from database successful.
          next: (data: TicketSearchResponse[]) => {
            return this.searchTicketResponses = data
          },

          // there are some errors when get tickets from database
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }

        })
    );

    // push to list of subscriptions for easily unsubscribes all subscriptions of the TicketListComponent
    this.subscriptions.push(

      //
      // get total of tickets and total pages
      //
      this.ticketService.getTotalOfTickets(
        userid,
        searchTerm,
        fromDate,
        toDate,
        categoryid,
        priorityid,
        creatorid,
        teamid,
        assigneeid,
        sla,
        ticketStatusid)

        .subscribe({

          // get total of tickets from database successful
          next: (data: number) => {
            // total of tickets
            this.totalOfTickets = data;
            // total pages
            this.totalPages = this.shareService.calculateTotalPages(this.totalOfTickets, this.pageSize);
          },

          // there are some errors when get total of tickets from database
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    )
  } // end of searchTickets()

  // initialize default values for all dropdown controls
  loadDropdownValues() {

    // load categories by userid(and by user role) into the "Category" dropdown
    this.loadCategoriesByUserid(this.userid)

    // load priorities by userid(and by user role) into the "Priority" dropdown
    this.loadPrioritiesByUserid(this.userid)

    // load creators by userid(and by user role) into the "Creator" dropdown
    this.loadCreatorsByUserid(this.userid)

    // load teams by userid(and by user role) into the "Team" dropdown
    this.loadTeamsByUserid(this.userid)

    // load assignees by userid(and by user role) into the "Assignee" dropdown
    this.loadAssigneesByUserid(this.userid)

    // load all ticket status into the "Status" dropdown
    this.loadAllTicketStatus()

  } // end of loadDropdownValues()

  // initialize values for "Ticket status".
  // 5 status + 1 dummy status:
  //  - 0: All(dummy)
  //  - 1: Open
  //  - 2: Assigned
  //  - 3: Resolved
  //  - 4: Closed
  //  - 5: Cancel
  loadAllTicketStatus() {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get all ticket status
      this.ticketService.getAllTicketStatus()

        .subscribe({

          // get all ticket status successful
          next: (data: DropdownResponse[]) => {

            // all ticket status
            this.allTicketStatus = data;

          },

          // there are some errors when get all ticket status
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    );
  } // end of loadAllTicketStatus()

  // load creators by userid(and by user role)
  loadCreatorsByUserid(userid: number) {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get creators by userid(and by user role)
      this.ticketService.getCreatorsByUserid(userid)

        .subscribe({

          // get creators by userid(and by user role) successful
          next: (data: DropdownResponse[]) => {

            // get creators by userid(and by user role)
            this.creators = data;

          },

          // there are some errors when get creators
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    );

    //
    // set default value for the "Creator" dropdown
    //

    // if role is "ROLE_CUSTOMER" then creator is him-self
    if (this.loggedInRole === "ROLE_CUSTOMER") {
      // this.userId + "": means convert number to string
      this.searchTicket.controls['creatorid'].setValue(this.userid + "");
    }

  } // end of loadCreatorsByUserid()

  // load teams userid(and by user role)
  loadTeamsByUserid(userid: number) {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get teams by userid(and by user role)
      this.ticketService.getTeamsByUserid(userid)

        .subscribe({

          // get teams successful
          next: (data: DropdownResponse[]) => {

            // teams by userid(and by user role)
            this.teams = data;

          },

          // there are some errors when get teams
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    );

  } // end of loadTeamsByUserid()

  // load assignees by userid(and by user role)
  loadAssigneesByUserid(userid: number) {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get assignees by userid(and by user role)
      this.ticketService.getAssigneesByUserid(userid)

        .subscribe({

          // get assignees successful
          next: (data: DropdownResponse[]) => {

            // assignees by userid(and by user role)
            this.assignees = data;

          },

          // there are some errors when get assignees
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    );

  } // end of loadAssigneesByUserid()

  // load priorities by userid(and by user role)
  loadPrioritiesByUserid(userid: number) {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get priorities by userid(and by user role)
      this.ticketService.getPrioritiesByUserid(userid)

        .subscribe({

          // get priorites successful
          next: (data: DropdownResponse[]) => {

            // priorities by userid(and by user role)
            this.priorities = data;

          },

          // there are some errors when get priorities
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    );
  } // end of loadAllPriorities()

  // load categories by userid(and by user role)
  loadCategoriesByUserid(userid: number) {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get categories by userid(and by user role)
      this.ticketService.getCategoriesByUserid(userid)

        .subscribe({

          // get categories successful
          next: (data: DropdownResponse[]) => {

            // categories by userid(and by user role)
            this.categories = data;

          },

          // there are some errors when get categories
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    );
  } // end of loadCategoriesByUserid()

  // load tooltips and placeholder
  loadTooltipPlaceholder() {

    //
    // tooltips for the "search form" and "table"
    //

    this.tooltips.set("fromDate", "- From ticket date(mm/dd/yyyy).<br>- Default value is the first day of current year");
    this.tooltips.set("toDate", "- To ticket date(mm/dd/yyyy).<br>- Default value is current date");
    this.tooltips.set("categoryid", "- Category.<br>- 'All' means all categories.<br>- Values include: Category id + Category name.<br>- Only display categories have ticket");
    this.tooltips.set("priorityid", "- Priority.<br>- 'All' means all priorities.<br>- Values include: Priority id + Priority name.<br>- Only display priorities have ticket");
    this.tooltips.set("creatorid", "- Creator(person creates ticket).<br>- 'All' means all creators.<br>- Only display creators have ticket");
    this.tooltips.set("teamid", "- Team.<br>- 'All' means all teams.<br>- Only display teams have ticket");
    this.tooltips.set("assigneeid", "- Assignee(a person will resove the ticket).<br>- 'All' means all supporters.<br>- Only display supporters have ticket");

    this.tooltips.set("sla", "- SLA(service level agreement).<br>- On time: ticket is on time.<br>- Late: ticket is late.<br>- All: means both 'On time' and 'Late'.");

    this.tooltips.set("ticketStatusid", "- Ticket status.<br>- <b>All</b>: all status.<br>- <b>Open</b>: ticket has not yet assigned to supporter.<br>- <b>Assigned</b>: ticket has been assigned to supporter.<br>- <b>Resolved</b>: ticket has been resolved.<br>- <b>Closed</b>: ticket has been closed.<br>- <b>Cancel</b>: ticket has been canceled.");
    this.tooltips.set("searchButton", "Search tickets");
    this.tooltips.set("createTicket", "Navigate to the 'Create ticket' screen");
    this.tooltips.set("extractExcel", "Navigate to the 'Extract excel' screen");

    // searchTerm

    // if user role is "Customer"
    if (this.loggedInRole === "ROLE_CUSTOMER") {

      this.placeholders.set("searchTerm", "Ticket id, subject");
      this.tooltips.set("searchTerm", "- Search term(ticket id, subject).<br>- Blank means search all ticket IDs, subjects");

    }

    // if user role is "Admin" or "Supporter"
    else {

      this.placeholders.set("searchTerm", "Ticket id, subject, creator phone/email");
      this.tooltips.set("searchTerm", "- Search term(ticket id, subject, creator phone, creator email).<br>- Blank means search all ticket IDs, subjects, creator phones, creator emails");
    }

    //
    // tooltips for the "pagination"
    //

    this.tooltipFirstPage = this.shareService.tooltips.get("firstPage");
    this.tooltipPreviousPage = this.shareService.tooltips.get("previousPage");
    this.tooltipCurrentPage = this.shareService.tooltips.get("currentPage");
    this.tooltipTotalPages = this.shareService.tooltips.get("totalPages");
    this.tooltipGoPage = this.shareService.tooltips.get("goPage");
    this.tooltipNextPage = this.shareService.tooltips.get("nextPage");
    this.tooltipLastPage = this.shareService.tooltips.get("lastPage");

  } // end of loadTooltipPlaceholder()



  // count index for current page
  // ex:  page 1: ord 1 --> ord 5
  //      page 2: ord 6 --> ord 10 (not repeat: ord 1 --> ord 5)
  // parameters:
  //  - currentPage: current page
  //  - index: running variable(the index variable of "for loop")
  indexBasedPage(pageSize: number, currentPage: number, index: number): number {

    return (this.shareService.indexBasedPage(pageSize, currentPage, index));
  }

  // go to specific page
  goPage() {

    // if (1 <= currentPage <= totalPages) then go to specific page
    if (this.currentPage >= 1 && this.currentPage <= this.totalPages) {

      // the "nth element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get tickets, total of tickets and total of pages
      this.searchTickets(
        this.userid,
        nth_element,
        this.searchTicket.value.searchTerm,
        this.searchTicket.value.fromDate,
        this.searchTicket.value.toDate,
        this.searchTicket.value.categoryid,
        this.searchTicket.value.priorityid,
        this.searchTicket.value.creatorid,
        this.searchTicket.value.teamid,
        this.searchTicket.value.assigneeid,
        this.searchTicket.value.sla,
        this.searchTicket.value.ticketStatusid);
    }

  } // end of goPage()

  // user changes the page number in the text box
  changePageNumber(value: number) {
    this.currentPage = value;
  }

  // move to the first page
  moveFirst() {

    // if current page is not the first page
    if (this.currentPage > 1) {

      this.currentPage = 1;

      // the "nth element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get tickets, total of tickets and total of pages
      this.searchTickets(
        this.userid,
        nth_element,
        this.searchTicket.value.searchTerm,
        this.searchTicket.value.fromDate,
        this.searchTicket.value.toDate,
        this.searchTicket.value.categoryid,
        this.searchTicket.value.priorityid,
        this.searchTicket.value.creatorid,
        this.searchTicket.value.teamid,
        this.searchTicket.value.assigneeid,
        this.searchTicket.value.sla,
        this.searchTicket.value.ticketStatusid);
    }

  } // end of moveFirst()

  // move to the next page
  moveNext() {

    // if current page is not the last page
    if (this.currentPage < this.totalPages) {

      this.currentPage = this.currentPage + 1;

      // the "nth element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get tickets, total of tickets and total of pages
      this.searchTickets(
        this.userid,
        nth_element,
        this.searchTicket.value.searchTerm,
        this.searchTicket.value.fromDate,
        this.searchTicket.value.toDate,
        this.searchTicket.value.categoryid,
        this.searchTicket.value.priorityid,
        this.searchTicket.value.creatorid,
        this.searchTicket.value.teamid,
        this.searchTicket.value.assigneeid,
        this.searchTicket.value.sla,
        this.searchTicket.value.ticketStatusid);
    }

  } // end of moveNext()

  // move to the previous page
  movePrevious() {

    // if current page is not the first page
    if (this.currentPage > 1) {

      this.currentPage = this.currentPage - 1;

      // the "nth element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get tickets, total of tickets and total of pages
      this.searchTickets(
        this.userid,
        nth_element,
        this.searchTicket.value.searchTerm,
        this.searchTicket.value.fromDate,
        this.searchTicket.value.toDate,
        this.searchTicket.value.categoryid,
        this.searchTicket.value.priorityid,
        this.searchTicket.value.creatorid,
        this.searchTicket.value.teamid,
        this.searchTicket.value.assigneeid,
        this.searchTicket.value.sla,
        this.searchTicket.value.ticketStatusid);
    }

  } // end of movePrevious()

  // move to the last page
  moveLast() {

    // if current page is not the last page
    if (this.currentPage < this.totalPages) {

      this.currentPage = this.totalPages;

      // the "nth element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get tickets, total of tickets and total of pages
      this.searchTickets(
        this.userid,
        nth_element,
        this.searchTicket.value.searchTerm,
        this.searchTicket.value.fromDate,
        this.searchTicket.value.toDate,
        this.searchTicket.value.categoryid,
        this.searchTicket.value.priorityid,
        this.searchTicket.value.creatorid,
        this.searchTicket.value.teamid,
        this.searchTicket.value.assigneeid,
        this.searchTicket.value.sla,
        this.searchTicket.value.ticketStatusid);
    }
  } // end of moveLast()

  // view specific team by id
  viewTicket(id: number) {
    this.router.navigate(['/ticket-view', id]);
  }


  // display total of elements is on the top-right of the table
  displayTotalOfElements(totalOfElements: number, singleElement: string, pluralElement: string): string {

    return this.shareService.displayTotalOfElements(totalOfElements, singleElement, pluralElement);

  } // end of displayTotalOfElements()

  // display total of elements is on the top-right of the table
  tooltipSlaDetail(ticketStatusid: number, createTime: Date, lastUpdateDatetime: Date,
    currentDatetime: Date, limitTimeToResolve: string, spentDayHhmm: string, sla: string): string {

    return this.shareService.tooltipSlaDetail(ticketStatusid, createTime, lastUpdateDatetime, currentDatetime,
      limitTimeToResolve, spentDayHhmm, sla);

  } // end of tooltipSlaDetail()

  // tooltipSlaDetail(ticketStatusid: number, createTime: Date, lastUpdateDatetime: Date,
  //   currentDatetime: Date, limitTimeToResolve: string, spentHourHhmmss: string,
  //   sla: string): string {

  // tooltipSlaDetail(ticket.ticketStatusid,ticket.createDatetime,ticket.lastUpdateDatetime,ticket.currentDatetime,ticket.resolveIn,ticket.spentHourHhmmss,ticket.sla

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "TeamListComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
