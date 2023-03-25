import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DropdownResponse } from 'src/app/entity/DropdownResponse';
import { TicketResponse } from 'src/app/entity/TicketResponse';
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

  tooptipWidth: number = 500;

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // current page
  currentPage: number = 1;
  // total pages
  totalPages: number;
  // total of tickets(for pagination)
  totalOfTickets: number;
  // ticket list(the grid of the team table)
  tickets: TicketResponse[] = [];
  // number of ticket per page(default = 5)
  pageSize: number;

  // user who logged in the system
  userid: number;

  // user role of the logged person in the system
  loggedInRole: string;

  // all ticket status
  allTicketStatus: DropdownResponse[] = [];

  // all creators
  creators: DropdownResponse[] = [];

  // all teams
  teams: DropdownResponse[] = [];

  // assignees
  assignees: DropdownResponse[] = [];

  // all priorities
  priorities: DropdownResponse[] = [];

  // all categories
  categories: DropdownResponse[] = [];

  // current date(ex: Vietnam local).
  // ex: Vietname time: 10:08 a.m , 21-Mar-2023
  // => new Date() = Tue Mar 21 2023 10:08:29 GMT+0700 (Indochina Time)
  currentDate = new Date();

  // first day of current month.
  // note:
  //  - this.currentDate.getFullYear(): current year(yyyy)
  //  - this.currentDate.getMonth(): current month(MM)
  //  - 1: first day
  //  - toLocaleString(): convert to string M/dd/yyyy
  //  - formatDate(...,"yyyy-MM-dd"): convert to format "yyyy-MM-dd"
  firstDayOfCurrentMonth = formatDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1)
    .toLocaleString(), "yyyy-MM-dd", "en-US");

  // current date(local) in format "yyyy-MM-dd"
  toDate = formatDate(this.currentDate.toLocaleString(), "yyyy-MM-dd", "en-US");

  // tooltips
  tooltips = new Map<string, string>();

  // placeholders
  placeholders = new Map<string, string>();

  // the "Search team" form
  searchTicket = this.formBuilder.group({

    // search term
    searchTerm: [''],
    // creator id
    creatorid: [''],
    // assignee id
    assigneeid: [''],
    // team id
    teamid: [''],
    // category id
    categoryid: ['0'],
    // priority id
    priorityid: ["0"],
    // first day of current month
    fromDate: [''],
    // current date
    toDate: [''],
    // SLA(service level agreement)
    sla: [''],
    // default values = "All"(id = 0)
    ticketStatusid: ["0"],

  });


  constructor(private ticketService: TicketService,
    private authService: AuthService,
    private shareService: ShareService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
  ) {

  }

  // this method ngOnInit() is run right after the contructor
  ngOnInit(): void {

    // initial page size(default = 5)
    this.pageSize = this.shareService.pageSize;

    // initial current page(in the front end)
    this.currentPage = 1;

    // user id who has logged in the system
    this.userid = +this.authService.getIdFromLocalStorage();

    // user role of person has just logged in the sytem
    this.loggedInRole = this.authService.getRoleFromLocalStorage();

    // tooltip and placeholder for searchTerm
    this.loadHtmlProperties();


    //----------------------------------------
    // initial values for all form controls
    //----------------------------------------

    // load creators by userid(and by user role) into the "Creator" dropdown
    this.loadCreatorsByUserid(this.userid)

    // load teams by userid(and by user role) into the "Team" dropdown
    this.loadTeamsByUserid(this.userid)

    // load assignees by userid(and by user role) into the "Assignees" dropdown
    this.loadAssigneesByUserid(this.userid)

    // load categories by userid(and by user role) into the "Category" dropdown
    this.loadCategoriesByUserid(this.userid)

    // load priorities by userid(and by user role) into the "Priority" dropdown
    this.loadPrioritiesByUserid(this.userid)

    // fromDate = first day of current month(local).
    this.searchTicket.controls['fromDate'].setValue(this.firstDayOfCurrentMonth);

    // toDate = current date(local)
    this.searchTicket.controls['toDate'].setValue(this.toDate);

    // load all ticket status into the "Status" dropdown
    this.loadAllTicketStatus()



    // assign teams from database to the this.teams variable, and get totalPages.
    // the first parameter(page) = 0: in MySQL 0 means the first page.
    this.searchTickets(this.userid, 0, this.searchTicket.value.searchTerm);

  } // end of ngOnInit()

  // initial values for "Ticket status".
  // 5 status + 1 dummy status:
  //  - All(dummy)
  //  - Open
  //  - Cancel
  //  - Assigned
  //  - Resolved
  //  - Closed
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

  // load creators userid(and by user role)
  loadCreatorsByUserid(userid: number) {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get all creators
      this.ticketService.getCreatorsByUserid(userid)

        .subscribe({

          // get all creators status successful
          next: (data: DropdownResponse[]) => {

            // all creators
            this.creators = data;

          },

          // there are some errors when get all ticket status
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    );

    // set default value for the "Creator" dropdown

    // if role is "ROLE_CUSTOMER" then creator is him-self
    if (this.loggedInRole === "ROLE_CUSTOMER") {
      // this.userId + "": means convert number to string
      this.searchTicket.controls['creatorid'].setValue(this.userid + "");
    }
    // if role is "ROLE_SUPPORTER" or "ROLE_ADMIN" then creator = "0"(All)
    else {
      this.searchTicket.controls['creatorid'].setValue("0");
    }

  } // end of loadCreatorsByUserid()

  // load teams userid(and by user role)
  loadTeamsByUserid(userid: number) {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get all creators
      this.ticketService.getTeamsByUserid(userid)

        .subscribe({

          // get all creators status successful
          next: (data: DropdownResponse[]) => {

            // all teams
            this.teams = data;

          },

          // there are some errors when get all ticket status
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    );

    this.searchTicket.controls['teamid'].setValue("0");

  } // end of loadCreatorsByUserid()

  // load assignees userid(and by user role)
  loadAssigneesByUserid(userid: number) {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get assignees
      this.ticketService.getAssigneesByUserid(userid)

        .subscribe({

          // get assignees successful
          next: (data: DropdownResponse[]) => {

            // assignees
            this.assignees = data;

          },

          // there are some errors when get all ticket status
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    );

    this.searchTicket.controls['assigneeid'].setValue("0");

  } // end of loadCreatorsByUserid()

  // load priorities by userid(and by user role)
  loadPrioritiesByUserid(userid: number) {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get all ticket status
      this.ticketService.getPrioritiesByUserid(userid)

        .subscribe({

          // get all ticket status successful
          next: (data: DropdownResponse[]) => {

            // all ticket status
            this.priorities = data;

          },

          // there are some errors when get all ticket status
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

      // get all ticket status
      this.ticketService.getCategoriesByUserid(userid)

        .subscribe({

          // get all ticket status successful
          next: (data: DropdownResponse[]) => {

            // all ticket status
            this.categories = data;

          },

          // there are some errors when get all ticket status
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    );
  } // end of loadCategoriesByUserid()

  // load tooltips.
  loadHtmlProperties() {

    // tooltips
    this.tooltips.set("fromDate", "- From ticket date(mm/dd/yyyy).<br>- Default value is the first day of current month");
    this.tooltips.set("toDate", "- To ticket date(mm/dd/yyyy).<br>- Default value is current date");
    this.tooltips.set("categoryid", "- Category.<br>- 'All' means all categories.<br>- Values include: Category id + Category name.<br>- Only display categories have ticket");
    this.tooltips.set("priorityid", "- Priority.<br>- 'All' means all priorities.<br>- Values include: Priority id + Priority name.<br>- Only display priorities have ticket");
    this.tooltips.set("creatorid", "- Creator(person creates ticket).<br>- 'All' means all creators.<br>- Only display creators have ticket");
    this.tooltips.set("teamid", "- Team.<br>- 'All' means all teams.<br>- Only display teams have ticket");
    this.tooltips.set("assigneeid", "- Assignee(a person will resove the ticket).<br>- 'All' means all supporters.<br>- Only display supporters have ticket");
    this.tooltips.set("sla", "- SLA(service level agreement).<br>- Check if a ticket is on time or late.");
    this.tooltips.set("ticketStatusid", "- Ticket status.<br>- <b>All</b>: all status.<br>- <b>Open</b>: ticket has not yet assigned to supporter.<br>- <b>Cancel</b>: ticket has been canceled.<br>- <b>Assigned</b>: ticket has been assigned to supporter.<br>- <b>Resolved</b>: ticket has been resolved.<br>- <b>Closed</b>: ticket has been closed.");
    this.tooltips.set("searchButton", "Search tickets");
    this.tooltips.set("createTicket", "Navigate to the 'Create ticket' screen");
    this.tooltips.set("extractExcel", "Navigate to the 'Extract excel' screen");

    // if user role is "Customer"
    if (this.loggedInRole === "ROLE_CUSTOMER") {

      this.placeholders.set("searchTerm", "Ticket id, subject, content");
      this.tooltips.set("searchTerm", "- Search term(ticket id, subject, content).<br>- Blank means search all ticket IDs, subjects, contents");

    }

    // if user role is "Admin" or "Supporter"
    else {

      this.placeholders.set("searchTerm", "Ticket id, subject, creator phone/email, content");
      this.tooltips.set("searchTerm", "- Search term(ticket id, subject, creator phone, creator email, content).<br>- Blank means search all ticket IDs, subjects, creator phones, creator emails, contents");
    }

  } // end of loadHtmlProperties()


  searchTickets(userid: number, pageNumber: number, searchTerm: string) {

    // push to list of subscriptions for easily unsubscribes all subscriptions of the TeamListComponent

    this.subscriptions.push(

      // get tickets
      this.ticketService.searchTickets(userid, pageNumber, searchTerm)

        .subscribe({

          // get team from database successful.
          // TeamResponse includes:
          //  - id
          //  - name
          //  - assignmentMethod
          //  - status
          // next: (data: TeamResponse[]) => {
          next: (data: TicketResponse[]) => {
            return this.tickets = data
          }

        })
    );

    // push to list of subscriptions for easily unsubscribes all subscriptions of the TeamListComponent
    this.subscriptions.push(

      // get total of teams and total pages
      this.ticketService.getTotalOfTickets(userid, searchTerm)

        .subscribe({

          // get total of teams from database successful
          next: (data: number) => {
            // total of teams
            this.totalOfTickets = data;
            // total pages
            this.totalPages = this.shareService.calculateTotalPages(this.totalOfTickets, this.pageSize);
          }
        })
    )
  } // end of searchTickets()

  // count index for current page
  // ex:  page 1: ord 1 --> ord 5
  //      page 2: ord 6 --> ord 10 (not repeat: ord 1 --> ord 5)
  // parameters:
  //  - currentPage: current page
  //  - index: running variable(the index variable of "for loop")
  indexBasedPage(pageSize: number, currentPage: number, index: number): number {

    // this.pageSize = 5
    // return (this.pageSize * (currentPage - 1)) + (index + 1);
    return (this.shareService.indexBasedPage(pageSize, currentPage, index));
  }

  // go to specific page
  goPage() {

    // if (1 <= currentPage <= totalPages) then go to specific page
    if (this.currentPage >= 1 && this.currentPage <= this.totalPages) {

      // the "nth element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get teams, total of teams and total of pages
      // this.searchTickets(nth_element, this.searchTicket.value.searchTerm,
      //   this.searchTicket.value.subject, this.searchTicket.value.ticketStatus);
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

      // get teams, total of teams and total pages
      // this.searchTickets(nth_element, this.searchTicket.value.searchTerm,
      //   this.searchTicket.value.subject, this.searchTicket.value.ticketStatus);
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

      // get teams, total of teams and total pages
      // this.searchTickets(nth_element, this.searchTicket.value.searchTerm,
      //   this.searchTicket.value.subject, this.searchTicket.value.ticketStatus);
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

      // get teams, total of teams and total pages
      // this.searchTickets(nth_element, this.searchTicket.value.searchTerm,
      //   this.searchTicket.value.subject, this.searchTicket.value.ticketStatus);
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

      // get teams, total of teams and total pages
      // this.searchTickets(nth_element, this.searchTicket.value.searchTerm,
      //   this.searchTicket.value.subject, this.searchTicket.value.ticketStatus);
    }
  } // end of moveLast()

  // view specific team by id
  viewTicket(id: number) {
    this.router.navigate(['/ticket-view', id]);
  }

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
