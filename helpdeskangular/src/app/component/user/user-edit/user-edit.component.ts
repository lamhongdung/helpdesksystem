import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/entity/User';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Save" button
  // =false: do not allow to display spinner in the "Save" button
  showSpinner: boolean;

  // use to unsubcribe all subscribe easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  userForm: FormGroup;
  user: User;

  // user id
  id: number;

  // error messages
  errorMessages = {

    firstName: [
      { type: 'required', message: 'Please input the first name' },
      { type: 'maxlength', message: 'First name cannot be longer than 50 characters' },
    ],
    lastName: [
      { type: 'required', message: 'Please input the last name' },
      { type: 'maxlength', message: 'Last name cannot be longer than 50 characters' },
    ],
    phone: [
      { type: 'required', message: 'Please input phone number' },
      { type: 'pattern', message: 'Phone number must be 10 digits length' }
    ],
    address: [
      { type: 'maxlength', message: 'Address cannot be longer than 300 characters' }
    ]
  };

  constructor(private router: Router,
    private userService: UserService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute) {

  }

  // initial values
  ngOnInit(): void {

    this.userForm = this.formBuilder.group({

      // do not need validate id because this "id" field is read only
      id: [''],
      
      // do not need validate email because this "email" field is read only.
      // email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      email: [''],

      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      address: ['', [Validators.maxLength(300)]],
      role: [''],
      status: ['']
    });

    // get user id from params of active route(from address path).
    // and then get user based on user id from database
    this.activatedRoute.paramMap.subscribe(
      
      (params: ParamMap) => {

        // get id from param of active route.
        // The "+"" sign: convert string to number. 
        this.id = +params.get('id');

        // get user by user id
        this.userService.findById(this.id).subscribe(

          // get data successful from database
          (data: User) => {

            this.user = data;

            // load user information to the userForm
            this.userForm.patchValue(data);

          },
          // there are some errors when get data from database
          (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        );
    });

  } // end of ngOnInit()

  // edit user.
  // when user clicks the "Save" button in the "Edit user"
  editUser() {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push the subscribe to a list of subscriptions in order to easily unsubscribe them when destroy the component
    this.subscriptions.push(

      // edit exsting user
      this.userService.editUser(this.userForm.value).subscribe(

        // update user successful
        (data: User) => {

          this.user = data;

          // send notification to user
          this.sendNotification(NotificationType.SUCCESS, `${data.lastName} ${data.firstName} is updated successfully`);

          // hide spinner(circle)
          this.showSpinner = false;

          // after update user successful then navigate to the "user-list" page
          this.router.navigateByUrl("/user-list");
        },
        // there are some errors when update user
        (errorResponse: HttpErrorResponse) => {

          // send failure message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      )
    );

  } // end of editUser()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "UserComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

} // end of the UserEditComponent