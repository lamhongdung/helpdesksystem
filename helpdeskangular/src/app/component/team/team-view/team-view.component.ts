import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { Calendar } from 'src/app/entity/Calendar';
import { TeamRequest } from 'src/app/entity/TeamRequest';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { CalendarService } from 'src/app/service/calendar.service';
import { NotificationService } from 'src/app/service/notification.service';
import { TeamService } from 'src/app/service/team.service';

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.css']
})
export class TeamViewComponent {

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // includes fields:
  //  - id
  //  - name
  //  - assignment method
  //  - calendarid
  //  - supporters
  //  - status
  teamForm: FormGroup;

  // team includes:
  //  - id
  //  - name
  //  - assignment method
  //  - calendarid
  //  - supporters
  //  - status
  team: TeamRequest;

  // all(active + inactive) calendars
  calendars: Calendar[] = [];

  // team id
  id: number;

  //
  // https://github.com/nileshpatel17/ng-multiselect-dropdown#readme
  //

  // setting for the supporters dropdown
  supporterSetting: IDropdownSettings;

  constructor(private teamService: TeamService,
    private calendarService: CalendarService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {


    this.subscriptions.push(

      // get all(active + inactive) calendars
      this.calendarService.getAllCalendars("")

        .subscribe({

          // get all(active + inactive) calendars successful
          next: (data: Calendar[]) => {

            // all(active + inactive) calendars
            this.calendars = data;
          },

          // there are some errors when get all(active + inactive) calendars
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    ); // end of this.subscriptions.push()
  } // end of constructor()

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

    this.teamForm = this.formBuilder.group({

      // initial values for fields
      id: [''],
      name: [''],
      assignmentMethod: [{ value: '', disabled: true }],
      calendarid: [{ value: '', disabled: true }],
      supporters: [{ value: '', disabled: true }],

      // initial empty value to the status, and disable it
      status: [{ value: '', disabled: true }]

    });

    // push into the subscriptions list in order to unsubscribes all easily
    this.subscriptions.push(

      // get team id from params of the active route.
      // and then get team based on team id from database
      this.activatedRoute.paramMap.subscribe({

        next: (params: ParamMap) => {

          // get id from param of active route.
          // ex: http://localhost:4200/team-view/:id
          // ex: http://localhost:4200/team-view/3
          // the sign "+": use to convert from string to number
          this.id = +params.get('id');

          // get team by team id
          this.teamService.findById(this.id).subscribe({

            // if there is no error when get data from database
            next: (data: TeamRequest) => {

              this.team = data;

              // load user information to the teamForm
              this.teamForm.patchValue(data);

            },
            // if there are some errors when get data from database
            error: (errorResponse: HttpErrorResponse) => {
              this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
            }
          });
        } // end of (params: ParamMap)
      }) // end of this.activatedRoute.paramMap.subscribe()
    ); // end of this.subscriptions.push()

  } // end of ngOnInit()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "PriorityViewComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}

