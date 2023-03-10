import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Priority } from 'src/app/entity/Priority';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { PriorityService } from 'src/app/service/priority.service';

@Component({
  selector: 'app-priority-edit',
  templateUrl: './priority-edit.component.html',
  styleUrls: ['./priority-edit.component.css']
})
export class PriorityEditComponent implements OnInit {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Save" button
  // =false: do not allow to display spinner in the "Save" button
  showSpinner: boolean;

  // use to unsubcribe all subscribe easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  priorityForm: FormGroup;

  priority: Priority;

  // priority id
  id: number;

  // error messages
  errorMessages = {
    name: [
      { type: 'required', message: 'Please input priority name' },
      { type: 'maxlength', message: 'Name cannot be longer than 50 characters' }
    ],
    resolveIn: [
      { type: 'required', message: 'Please input "Resolve in(hours)"' },
      { type: 'pattern', message: 'Value of the "Resolve In" must be greater than or equal to zero' }
    ]
  };

  constructor(private router: Router,
    private priorityService: PriorityService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute) {

  }

  // initial values
  ngOnInit(): void {

    // initial form
    this.priorityForm = this.formBuilder.group({

      // do not need validate id because this "id" field is read only
      id: [''],

      // required and max length = 50 characters
      name: ['', [Validators.required, Validators.maxLength(50)]],

      // required and must be a positive number(>=0)
      resolveIn: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],

      // initial value = 'Active'
      status: ['Active']
    });

    // get priority id from params of the active route(from address path).
    // and then get priority based on priority id from database
    this.activatedRoute.paramMap.subscribe(

      (params: ParamMap) => {

        // get id from param of active route.
        // The "+"" sign: convert string to number. 
        this.id = +params.get('id');

        // get priority by priority id
        this.priorityService.findById(this.id).subscribe(

          // get priority from database
          (data: Priority) => {

            this.priority = data;

            // load priority information to the priorityForm
            this.priorityForm.patchValue(data);

          },

          // there is error when get priority from database
          (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        );
      });

  } // end of ngOnInit()

  // edit priority.
  // when user clicks the "Save" button in the "Edit priority"
  editPriority() {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push the subscribe to a list of subscriptions in order to easily unsubscribe them when destroy the component
    this.subscriptions.push(

      // edit exsting priority
      this.priorityService.editPriority(this.priorityForm.value).subscribe(

        // update priority successful
        (data: Priority) => {

          this.priority = data;

          // send notification to user
          this.sendNotification(NotificationType.SUCCESS, `Priority '${data.name}' is updated successfully`);

          // hide spinner(circle)
          this.showSpinner = false;

          // after update priority successful then navigate to the "priority-list" page
          this.router.navigateByUrl("/priority-list");
        },
        
        // there are some errors when update priority
        (errorResponse: HttpErrorResponse) => {

          // send failure message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      )
    );

  } // end of editPriority()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "PriorityEditComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

} // end of the PriorityEditComponent
