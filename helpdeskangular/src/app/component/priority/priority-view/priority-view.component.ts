import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Priority } from 'src/app/entity/Priority';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { PriorityService } from 'src/app/service/priority.service';

@Component({
  selector: 'app-priority-view',
  templateUrl: './priority-view.component.html',
  styleUrls: ['./priority-view.component.css']
})
export class PriorityViewComponent implements OnInit {

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  priorityForm: FormGroup;

  priority: Priority;

  // priority id
  id: number;

  constructor(private priorityService: PriorityService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute) {

  }

  // initial values
  ngOnInit(): void {

    this.priorityForm = this.formBuilder.group({

      // initial values for fields
      id: [''],
      name: [''],
      resolveIn: [''],

      // initial empty value to the status, and disable it
      status: [{ value: '', disabled: true }]

    });

    // get priority id from params of the active route.
    // and then get priority based on priority id from database
    this.activatedRoute.paramMap.subscribe({

      next: (params: ParamMap) => {

        // get id from param of active route.
        // ex: http://localhost:4200/priority-view/:id
        // ex: http://localhost:4200/priority-view/3
        // the sign "+": use to convert from string to number
        this.id = +params.get('id');

        // get priority by priority id
        this.priorityService.findById(this.id).subscribe({

          // if there is no error when get data from database
          next: (data: Priority) => {

            this.priority = data;

            // load user information to the priorityForm
            this.priorityForm.patchValue(data);

          },
          // if there is error when get data from database
          error: (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        });
      } // end of (params: ParamMap)
    }); // end of this.activatedRoute.paramMap.subscribe()

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
