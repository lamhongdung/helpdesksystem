import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Team } from 'src/app/entity/Team';
// import { TeamResponse } from 'src/app/entity/TeamResponse';
import { ShareService } from 'src/app/service/share.service';
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
  // teams: TeamResponse[] = [];
  teams: Team[] = [];
  // number of teams per page(default = 5)
  pageSize: number;

  // the "Search team" form
  searchTeam = this.formBuilder.group({

    // search term
    searchTerm: [''],
    // assignment method
    assignmentMethod: [''],
    // status
    status: [''],

  });


  constructor(private teamService: TeamService,
    private shareService: ShareService,
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

  // get teams, total of teams and total pages.
  // parameters:
  //  - pageNumber: page number
  //  - search term: id, team name
  //  - assignmentMethod: ''(all), 'Auto', 'Manual'
  //  - status: ''(all), 'Active', 'Inactive'
  searchTeams(pageNumber: number, searchTerm: string, assignmentMethod: string, status: string) {

    // push to list of subscriptions for easily unsubscribes all subscriptions of the TeamListComponent
    this.subscriptions.push(

      // get teams
      this.teamService.searchTeams(pageNumber, searchTerm, assignmentMethod, status)

        .subscribe({

          // get team from database successful.
          // TeamResponse includes:
          //  - id
          //  - name
          //  - assignmentMethod
          //  - status
          // next: (data: TeamResponse[]) => {
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

          // get total of teams from database successful
          next: (data: number) => {
            // total of teams
            this.totalOfTeams = data;
            // total pages
            this.totalPages = this.shareService.calculateTotalPages(this.totalOfTeams, this.pageSize);
          }
        })
    )
  } // end of searchTeams()

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
      this.searchTeams(nth_element, this.searchTeam.value.searchTerm,
        this.searchTeam.value.assignmentMethod, this.searchTeam.value.status);
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
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

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
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

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
      // let nth_element = (this.pageSize) * (this.currentPage - 1);
      let nth_element = this.shareService.countNthElement(this.pageSize, this.currentPage);

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
