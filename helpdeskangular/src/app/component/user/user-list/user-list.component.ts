import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/entity/User';
import { ShareService } from 'src/app/service/share.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // current page
  currentPage: number = 1;
  // total pages
  totalPages: number;
  // total of users(for pagination)
  totalOfUsers: number;
  // user list(the grid of user table)
  users: User[] = [];
  // number of users per a page(default = 5)
  pageSize: number;

  // form of "Search User"
  searchUser = this.formBuilder.group({

    // search ID, email, firstName, lastName and phone
    searchTerm: [''],
    // role
    role: [''],
    // status
    status: [''],

  });


  constructor(private userService: UserService,
    private shareService: ShareService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  // this method ngOnInit() is run right after the contructor
  ngOnInit(): void {

    // initial page size(default = 5)
    this.pageSize = this.userService.pageSize;

    // initial current page(in the front end)
    this.currentPage = 1;

    // assign users from database to the this.users variable, and get totalPages.
    // first parameter = 0: In MySQL 0 means the first page
    this.searchUsers(0, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status);

  } // end of ngOnInit()

  // get users, total of users and total pages
  searchUsers(pageNumber: number, searchTerm: string, role: string, status: string) {

    // push to list of subscriptions for easily unsubscribes all subscriptions of the UserListComponent
    this.subscriptions.push(

      // get users
      this.userService.searchUsers(pageNumber, searchTerm, role, status)
        .subscribe({
          next: (data: User[]) => {
            return this.users = data
          }
        })
    );

    // push to list of subscriptions for easily unsubscribes all subscriptions of the UserListComponent
    this.subscriptions.push(

      // get total of users and total pages
      this.userService.getTotalOfUsers(searchTerm, role, status)
        .subscribe({
          next: (data: number) => {
            // total of users
            this.totalOfUsers = data;
            // total of pages
            this.totalPages = this.shareService.calculateTotalPages(this.totalOfUsers, this.pageSize);
          }
        })
    )
  }

  // count index for current page
  // ex:  page 1: ord 1 --> ord 5
  //      page 2: ord 6 --> ord 10 (not repeat: ord 1 --> ord 5)
  // parameters:
  //  - currentPage: current page
  //  - index: running variable(the index variable of "for loop")
  indexBasedPage(pageSize:number, currentPage: number, index: number): number {

    // this.pageSize = 5
    // return (this.pageSize * (currentPage - 1)) + (index + 1);
    return (this.shareService.indexBasedPage(pageSize, currentPage, index));
  }

  // go to specific page
  goPage() {

    // if (1 <= currentPage <= totalPages) then go to specific page
    if (this.currentPage >= 1 && this.currentPage <= this.totalPages) {

      // the "nth element" in MySQL
      // let sqlPage = (this.currentPage * this.pageSize) - this.pageSize;
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get users, total of users and total of pages
      this.searchUsers(nth_element, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status);
    }

  }

  // user changes page number in the text box
  indexPaginationChange(value: number) {
    this.currentPage = value;
  }

  // move to the first page
  moveFirst() {

    // if current page is not the first page
    if (this.currentPage > 1) {

      this.currentPage = 1;

      // the "nth element" in MySQL
      // let sqlPage = (this.currentPage * this.pageSize) - this.pageSize;
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get users, total of users and total pages
      this.searchUsers(nth_element, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status);
    }

  }

  // move to the next page
  moveNext() {

    // if current page is not the last page
    if (this.currentPage < this.totalPages) {

      this.currentPage = this.currentPage + 1;

      // the "nth element" in MySQL
      // let sqlPage = (this.currentPage * this.pageSize) - this.pageSize;
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get users, total of users and total pages
      this.searchUsers(nth_element, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status);
    }

  }

  // move to the previous page
  movePrevious() {

    // if current page is not the first page
    if (this.currentPage > 1) {

      this.currentPage = this.currentPage - 1;

      // the "nth element" in MySQL
      // let sqlPage = (this.currentPage * this.pageSize) - this.pageSize;
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get users, total of users and total of pages
      this.searchUsers(nth_element, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status);
    }

  }

  // move to the last page
  moveLast() {

    // if current page is not the last page
    if (this.currentPage < this.totalPages) {

      this.currentPage = this.totalPages;

      // the "nth element" in MySQL
      // let sqlPage = (this.currentPage * this.pageSize) - this.pageSize;
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

      // get users, total of users and total of pages
      this.searchUsers(nth_element, this.searchUser.value.searchTerm, this.searchUser.value.role, this.searchUser.value.status);
    }
  }

  // view specific user by user id
  viewUser(id: number) {
    this.router.navigate(['/user-view', id]);
  }

  // unsubscribe all subscriptions from this component "UserComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}