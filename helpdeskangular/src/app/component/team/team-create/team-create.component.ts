import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
// import { Calendar } from 'src/app/entity/Calendar';
import { Supporter } from 'src/app/entity/Supporter';
import { Team } from 'src/app/entity/Team';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
// import { CalendarService } from 'src/app/service/calendar.service';
import { NotificationService } from 'src/app/service/notification.service';
import { TeamService } from 'src/app/service/team.service';

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.css']
})
export class TeamCreateComponent implements OnInit {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Save" button
  // =false: do not allow to display spinner in the "Save" button
  showSpinner: boolean;

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // team form
  teamForm: FormGroup;

  // active supporters
  activeSupporters: Supporter[] = [];

  // // all active calendars
  // calendars: Calendar[] = [];

  errorMessages = {
    name: [
      { type: 'required', message: 'Please input team name' },
      { type: 'maxlength', message: 'Name cannot be longer than 50 characters' }
    ],
    // calendarid: [
    //   { type: 'required', message: 'Please choose at least 1 active calendar' }
    // ],
    supporters: [
      { type: 'required', message: 'Please choose at least 1 active supporter' }
    ]
  };

  //
  // https://www.npmjs.com/package/ng-multiselect-dropdown?activeTab=readme
  //

  // setting for the supporters dropdown
  supporterSetting: IDropdownSettings;

  constructor(private router: Router,
    private teamService: TeamService,
    // private calendarService: CalendarService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService) {

    // this.subscriptions.push(

    //   // get all active calendars
    //   this.calendarService.getAllCalendars("Active")

    //     .subscribe({

    //       // get all active calendars successful
    //       next: (data: Calendar[]) => {

    //         // all active calendars
    //         this.calendars = data;

    //         // // assign the first value of the calendar to the 'calendarid' field
    //         // this.teamForm.controls['calendarid'].setValue(this.calendars[0]?.id);
    //       },

    //       // there are some errors when get all active calendars
    //       error: (errorResponse: HttpErrorResponse) => {

    //         // show the error message to user
    //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

    //       }
    //     })
    // );

  }

  // this method ngOnInit() is run after the component "TeamCreateComponent" is contructed
  ngOnInit(): void {

    // setting for the supporters dropdown(multi select)
    this.supporterSetting = {

      // allow to choose multi supporters
      singleSelection: false,
      // id field
      idField: 'id',
      // textField: id + fullname(lastName + firstName) + email + status
      textField: 'description',
      // allow to choose 'Select all'
      selectAllText: 'Select All',
      // allow to choose 'Unselect all'
      unSelectAllText: 'UnSelect All',
      // allow search filter
      allowSearchFilter: true

    };


    // initial form
    this.teamForm = this.formBuilder.group({

      // required and max length = 50 characters
      name: ['', [Validators.required, Validators.maxLength(50)]],

      // initial value = 'A'(Auto)
      assignmentMethod: ['A'],

      // // required. 
      // // initial value = first value of the calendar(is set in the constructor method)
      // calendarid: ['', [Validators.required]],

      // required and initial value = ''
      supporters: ['', [Validators.required]],

      // initial value = 'Active'
      status: ['Active']

    });

    //
    // get active supporters from database
    //

    // push into the subscriptions list in order to unsubscribes all easily
    this.subscriptions.push(

      // get active supporters
      this.teamService.getActiveSupporters()

        .subscribe({

          // get active supporters successful
          next: (data: Supporter[]) => {

            // active supporters
            this.activeSupporters = data;

          },

          // there are some errors when get active supporters
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })

    );

  } // end of ngOnInit()

  // create team.
  // when user clicks the "Save" button in the "Create team" screen
  createTeam() {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push into the subscriptions list in order to unsubscribes all easily
    this.subscriptions.push(

      // create team.
      // "this.teamForm.value": includes:
      //  - name(team name)
      //  - assignment method
      //  - supporters
      //  - status
      this.teamService.createTeam(this.teamForm.value).subscribe({

        // create team successful.
        // class Team: includes fields:
        //  - id
        //  - name
        //  - assignment method
        //  - supporters
        //  - status
        next: (data: Team) => {

          // show the "successful message" to user 
          this.sendNotification(NotificationType.SUCCESS, `Team ${data.name} is created successfully`);

          // hide spinner(circle)
          this.showSpinner = false;

          // navigate to the "team-list" page
          this.router.navigateByUrl("/team-list");
        },

        // create team failure
        error: (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      })
    );

  } // end of createTeam()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "TeamCreateComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

} // end of the TeamCreateComponent class
