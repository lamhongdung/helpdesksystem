import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Priority } from 'src/app/payload/Priority';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { PriorityService } from 'src/app/service/priority.service';
import { ShareService } from 'src/app/service/share.service';

@Component({
  selector: 'app-priority-list',
  templateUrl: './priority-list.component.html',
  styleUrls: ['./priority-list.component.css']
})
export class PriorityListComponent implements OnInit {

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // current page
  currentPage: number = 1;
  // total pages
  totalPages: number;
  // total of priorities(for pagination)
  totalOfPriorities: number;
  // priority list(the grid of the priority table)
  priorities: Priority[] = [];
  // number of priorities per a page(default = 5)
  pageSize: number;

  // tooltips
  tooltipFirstPage: string;
  tooltipPreviousPage: string;
  tooltipCurrentPage: string;
  tooltipTotalPages: string;
  tooltipGoPage: string;
  tooltipNextPage: string;
  tooltipLastPage: string;

  errorMessages = {
    resolveIn: [
      { type: 'pattern', message: 'Value of the Resolve In must be greater than or equal to zero' }
    ]
  };

  // initial value for the "search form"
  searchPriority = this.formBuilder.group({

    // search term
    searchTerm: [''],

    // resolveIn operator: >=(gt), =(eq), <=(lt)
    resolveInOpt: ['gt'],

    // resolve in(hours)
    resolveIn: [0, [Validators.pattern("^[0-9]+$")]],

    // status
    status: [''],

  });


  constructor(private priorityService: PriorityService,
    private shareService: ShareService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  // this method ngOnInit() is run right after the contructor
  ngOnInit(): void {

    // initial page size(default = 5)
    this.pageSize = this.priorityService.pageSize;

    // initial current page(in the front end)
    this.currentPage = 1;

    // tooltips
    this.tooltipFirstPage = this.shareService.tooltips.get("firstPage");
    this.tooltipPreviousPage = this.shareService.tooltips.get("previousPage");
    this.tooltipCurrentPage = this.shareService.tooltips.get("currentPage");
    this.tooltipTotalPages = this.shareService.tooltips.get("totalPages");
    this.tooltipGoPage = this.shareService.tooltips.get("goPage");
    this.tooltipNextPage = this.shareService.tooltips.get("nextPage");
    this.tooltipLastPage = this.shareService.tooltips.get("lastPage");

    // assign priorities from database to the this.priorities variable, and get totalPages.
    // the first parameter(page) = 0: in MySQL 0 means the first page.
    this.searchPriorities(0, this.searchPriority.value.searchTerm,
      this.searchPriority.value.resolveInOpt,
      this.searchPriority.value.resolveIn,
      this.searchPriority.value.status);

  } // end of ngOnInit()

  // get priorities, total of priorities and total pages
  // parameters:
  //  - pageNumber: page number
  //  - searchTerm: search term(ID, name)
  //  - resolveInOpt: gt(>=), eq(=), lt(<=)
  //  - resolveIn: number of hours to complete a ticket
  //  - status: '', 'Active', 'Inactive'  
  searchPriorities(pageNumber: number, searchTerm: string, resolveInOpt: string, resolveIn: number, status: string) {

    // // resolveIn value in number
    // let resolveInValue: number = 0;

    // if the ResolveIn textbox is blank then set its value to zero
    if (resolveIn == null) {

      resolveIn = 0;

      // update the zero value to the ResolveIn textbox
      this.searchPriority.get("resolveIn").setValue(0);

    }

    // push to list of subscriptions for easily unsubscribes all subscriptions of the PriorityListComponent
    this.subscriptions.push(

      // get priorities
      this.priorityService.searchPriorities(pageNumber, searchTerm, resolveInOpt, resolveIn, status)

        .subscribe({
          next: (data: Priority[]) => {
            return this.priorities = data
          }
        })
    );

    // push to list of subscriptions for easily unsubscribes all subscriptions of the PriorityListComponent
    this.subscriptions.push(

      // get total of priorities and total pages
      this.priorityService.getTotalOfPriorities(searchTerm, resolveInOpt, resolveIn, status)

        .subscribe({
          // get total of priorites successful
          next: (data: number) => {
            // total of priorities
            this.totalOfPriorities = data;
            // total pages
            this.totalPages = this.shareService.calculateTotalPages(this.totalOfPriorities, this.pageSize);

          },

          // get total of priorites failure
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }

        })
    )
  } // end of searchPriorities()

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

      // the "n th element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get priorities, total of priorities and total of pages
      this.searchPriorities(nth_element, this.searchPriority.value.searchTerm,
        this.searchPriority.value.resolveInOpt,
        this.searchPriority.value.resolveIn,
        this.searchPriority.value.status);
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

      // the " th element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get priorities, total of priorities and total pages
      this.searchPriorities(nth_element, this.searchPriority.value.searchTerm,
        this.searchPriority.value.resolveInOpt,
        this.searchPriority.value.resolveIn,
        this.searchPriority.value.status);
    }

  }

  // move to the next page
  moveNext() {

    // if current page is not the last page
    if (this.currentPage < this.totalPages) {

      this.currentPage = this.currentPage + 1;

      // the "n th element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get priorities, total of priorities and total pages
      this.searchPriorities(nth_element, this.searchPriority.value.searchTerm,
        this.searchPriority.value.resolveInOpt,
        this.searchPriority.value.resolveIn,
        this.searchPriority.value.status);
    }

  }

  // move to the previous page
  movePrevious() {

    // if current page is not the first page
    if (this.currentPage > 1) {

      this.currentPage = this.currentPage - 1;

      // the "n th element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get priorities, total of priorities and total pages
      this.searchPriorities(nth_element, this.searchPriority.value.searchTerm,
        this.searchPriority.value.resolveInOpt,
        this.searchPriority.value.resolveIn,
        this.searchPriority.value.status);
    }

  }

  // move to the last page
  moveLast() {

    // if current page is not the last page
    if (this.currentPage < this.totalPages) {

      this.currentPage = this.totalPages;

      // the "n th element" in MySQL
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get priorities, total of priorities and total pages
      this.searchPriorities(nth_element, this.searchPriority.value.searchTerm,
        this.searchPriority.value.resolveInOpt,
        this.searchPriority.value.resolveIn,
        this.searchPriority.value.status);
    }
  }

  // view specific priority by id
  viewPriority(id: number) {
    this.router.navigate(['/priority-view', id]);
  }

  // display total of elements is on the top-right of the table
  displayTotalOfElements(totalOfElements: number, singleElement: string, pluralElement: string): string {

    return this.shareService.displayTotalOfElements(totalOfElements, singleElement, pluralElement);

  } // end of displayTotalOfElements()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "PriorityListComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

