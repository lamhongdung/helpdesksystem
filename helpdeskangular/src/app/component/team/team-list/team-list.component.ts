import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Team } from 'src/app/entity/Team';
import { TeamService } from 'src/app/service/team.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // current page
  currentPage: number = 1;
  // total pages
  totalPages: number;
  // total of teams(for pagination)
  totalOfTeams: number;
  // team list(the grid of the team table)
  teams: Team[] = [];
  // number of teams per page(default = 5)
  pageSize: number;

  // form of "Search team"
  searchTeam = this.formBuilder.group({

    // search term
    searchTerm: [''],
    // assignment method
    assignmentMethod: [''],
    // status
    status: [''],

  });


  constructor(private teamService: TeamService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  // this method ngOnInit() is run right after the contructor
  ngOnInit(): void {

    // initial page size(default = 5)
    this.pageSize = this.teamService.pageSize;

    // initial current page(in the front end)
    this.currentPage = 1;

    // assign teams from database to the this.teams variable, and get totalPages.
    // the first parameter(page) = 0: in MySQL 0 means the first page.
    this.searchTeams(0, this.searchTeam.value.searchTerm, this.searchTeam.value.assignmentMethod, this.searchTeam.value.status);

  } // end of ngOnInit()

  // get teams, total of teams and total pages
  searchTeams(pageNumber: number, searchTerm: string, assignmentMethod: string, status: string) {

    // push to list of subscriptions for easily unsubscribes all subscriptions of the TeamListComponent
    this.subscriptions.push(

      // get teams
      this.teamService.searchTeams(pageNumber, searchTerm, assignmentMethod, status)

        .subscribe({
          next: (data: Team[]) => {
            return this.teams = data
          }
        })
    );

    // push to list of subscriptions for easily unsubscribes all subscriptions of the TeamListComponent
    this.subscriptions.push(

      // get total of teams and total pages
      this.teamService.getTotalOfTeams(searchTerm, assignmentMethod, status)

        .subscribe({
          next: (data: number) => {
            // total of teams
            this.totalOfTeams = data;
            // total pages
            this.totalPages = this.calculateTotalPages(this.totalOfTeams, this.pageSize);
          }
        })
    )
  } // end of searchTeams()

  // calculate total pages for pagination
  calculateTotalPages(totalOfTeams: number, pageSize: number): number {

    if ((totalOfTeams % pageSize) != 0) {
      //  Math.floor: rounds down and returns the largest integer less than or equal to a given number
      return (Math.floor(totalOfTeams / pageSize)) + 1;
    }

    return totalOfTeams / pageSize;

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

      // get teams, total of teams and total of pages
      this.searchTeams(nth_element, this.searchTeam.value.searchTerm,
        this.searchTeam.value.assignmentMethod, this.searchTeam.value.status);
    }

  } // end of goPage()

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

      // get teams, total of teams and total pages
      this.searchTeams(nth_element, this.searchTeam.value.searchTerm,
        this.searchTeam.value.assignmentMethod, this.searchTeam.value.status);
    }

  } // end of moveFirst()

  // move to the next page
  moveNext() {

    // if current page is not the last page
    if (this.currentPage < this.totalPages) {

      this.currentPage = this.currentPage + 1;

      // the "nth element" in MySQL
      let nth_element = (this.pageSize) * (this.currentPage - 1);

      // get teams, total of teams and total pages
      this.searchTeams(nth_element, this.searchTeam.value.searchTerm,
        this.searchTeam.value.assignmentMethod, this.searchTeam.value.status);
    }

  } // end of moveNext()

  // move to the previous page
  movePrevious() {

    // if current page is not the first page
    if (this.currentPage > 1) {

      this.currentPage = this.currentPage - 1;

      // the "nth element" in MySQL
      let nth_element = (this.pageSize) * (this.currentPage - 1);

      // get teams, total of teams and total pages
      this.searchTeams(nth_element, this.searchTeam.value.searchTerm,
        this.searchTeam.value.assignmentMethod, this.searchTeam.value.status);
    }

  } // end of movePrevious()

  // move to the last page
  moveLast() {

    // if current page is not the last page
    if (this.currentPage < this.totalPages) {

      this.currentPage = this.totalPages;

      // the "nth element" in MySQL
      let nth_element = (this.pageSize) * (this.currentPage - 1);

      // get teams, total of teams and total pages
      this.searchTeams(nth_element, this.searchTeam.value.searchTerm,
        this.searchTeam.value.assignmentMethod, this.searchTeam.value.status);
    }
  } // end of moveLast()

  // view specific team by id
  viewTeam(id: number) {
    this.router.navigate(['/team-view', id]);
  }

  // unsubscribe all subscriptions from this component "TeamListComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
