import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Priority } from 'src/app/entity/Priority';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { PriorityService } from 'src/app/service/priority.service';

@Component({
  selector: 'app-priority-create',
  templateUrl: './priority-create.component.html',
  styleUrls: ['./priority-create.component.css']
})
export class PriorityCreateComponent implements OnInit {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Save" button
  // =false: do not allow to display spinner in the "Save" button
  showSpinner: boolean;

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  priorityForm: FormGroup;

  priority: Priority;

  errorMessages = {
    name: [
      { type: 'required', message: 'Please input priority name' },
      { type: 'maxlength', message: 'Name cannot be longer than 50 characters' }
    ],
    resolveIn: [
      { type: 'required', message: 'Please input Resolve in(hours)' },
      { type: 'pattern', message: 'Value of the Resolve In must be greater than or equal to zero' }
    ]
  };

  constructor(private router: Router,
    private priorityService: PriorityService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService) { }

  // this method ngOnInit() is run after the component "PriorityCreateComponent" is contructed
  ngOnInit(): void {

    // initial form
    this.priorityForm = this.formBuilder.group({

      // required and max length = 50 characters
      name: ['', [Validators.required, Validators.maxLength(50)]],

      // required and must be a positive number(>=0)
      resolveIn: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],

      // initial value = 'Active'
      status: ['Active']
    });

  } // end of ngOnInit()

  // create priority.
  // when user clicks the "Save" button in the "Create priority" screen
  createPriority() {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push into the subscriptions list in order to unsubscribes all easily
    this.subscriptions.push(

      // create priority
      this.priorityService.createPriority(this.priorityForm.value).subscribe(

        // create priority successful
        (data: Priority) => {

          this.priority = data;

          // show successful message to user 
          this.sendNotification(NotificationType.SUCCESS, `Priority '${data.name}' is created successfully`);

          // hide spinner(circle)
          this.showSpinner = false;

          // navigate to the "priority-list" page
          this.router.navigateByUrl("/priority-list");
        },

        // create priority failure
        (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      )
    );

  } // end of createPriority()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "PriorityCreateComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

} // end of the PriorityCreateComponent class