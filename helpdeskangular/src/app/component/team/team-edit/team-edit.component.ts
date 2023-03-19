import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
  selector: 'app-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.css']
})
export class TeamEditComponent {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Save" button
  // =false: do not allow to display spinner in the "Save" button
  showSpinner: boolean;

  // use to unsubcribe all subscribe easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // includes fields:
  //  - id
  //  - name
  //  - assignment method
  //  - supporters
  //  - status
  teamForm: FormGroup;

  // team includes:
  //  - id
  //  - name
  //  - assignment method
  //  - supporters
  //  - status
  team: Team;

  // // Calendar includes:
  // //  - id
  // //  - name
  // //  - status
  // calendars: Calendar[] = [];

  // active supporters
  activeSupporters: Supporter[] = [];

  // team id
  id: number;

  // error messages
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
  // https://github.com/nileshpatel17/ng-multiselect-dropdown#readme
  //

  // setting for the supporters dropdown
  supporterSetting: IDropdownSettings;

  constructor(private router: Router,
    private teamService: TeamService,
    // private calendarService: CalendarService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    // this.subscriptions.push(

    //   // get active) calendars
    //   this.calendarService.getAllCalendars("Active")

    //     .subscribe({

    //       // get all calendars successful
    //       next: (data: Calendar[]) => {

    //         // all calendars
    //         this.calendars = data;
    //       },

    //       // there are some errors when get all calendars
    //       error: (errorResponse: HttpErrorResponse) => {

    //         // show the error message to user
    //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

    //       }
    //     })
    // );
  }

  // initial values
  ngOnInit(): void {

    // setting for the supporters dropdown(multi selection) 
    this.supporterSetting = {

      // allow to choose multi supporters
      singleSelection: false,
      // id field
      idField: 'id',
      // textField: id + fullname(lastName + firstName) + email + status
      textField: 'description',
      // naming of 'Select all'
      selectAllText: 'Select All',
      // naming of 'Unselect all'
      unSelectAllText: 'UnSelect All',
      // allow search filter
      allowSearchFilter: true

    };

    // initial form
    this.teamForm = this.formBuilder.group({

      // do not need validate id because this "id" field is read only
      id: [''],

      // required and max length = 50 characters
      name: ['', [Validators.required, Validators.maxLength(50)]],

      // assignment method
      assignmentMethod: [''],

      // //calendar id
      // calendarid: ['', [Validators.required]],

      // active supporters
      supporters: ['', [Validators.required]],

      // team status
      status: ['']
    });

    //
    // get active supporters from database
    //

    // push into the subscriptions list in order to unsubscribes all easily
    this.subscriptions.push(


      // get active supporters
      this.teamService.getActiveSupporters().subscribe({

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

    // get team id from params of the active route(from address path).
    // and then get team based on team id from database
    this.activatedRoute.paramMap.subscribe({

      next: (params: ParamMap) => {

        // get id from param of active route.
        // The "+"" sign: convert string to number. 
        this.id = +params.get('id');

        // get team by team id
        this.teamService.findById(this.id).subscribe({

          // get team successful from database
          next: (data: Team) => {

            this.team = data;

            // load team information(includes supporters) to the teamForm
            this.teamForm.patchValue(data);

          },
          // there are some errors when get team from database
          error: (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        });
      }
    });

  } // end of ngOnInit()

  // edit team.
  // when user clicks on the "Save" button in the "Edit team" screen
  editTeam() {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push the subscribe to a list of subscriptions in order to easily unsubscribe them when destroy the component
    this.subscriptions.push(

      // edit exsting team.
      // this.teamForm.value: includes:
      //  - id
      //  - name
      //  - assignment method
      //  - supporters
      //  - status
      this.teamService.editTeam(this.teamForm.value).subscribe({

        // update team successful
        next: (data: Team) => {

          this.team = data;

          // send notification to user
          this.sendNotification(NotificationType.SUCCESS, `Team '${data.name}' is updated successfully`);

          // hide spinner(circle)
          this.showSpinner = false;

          // after update team successful then navigate to the "team-list" page
          this.router.navigateByUrl("/team-list");
        },

        // there are some errors when update team
        error: (errorResponse: HttpErrorResponse) => {

          // send failure message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      })
    );

  } // end of editTeam()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "TeamEditComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

} // end of the TeamEditComponent
