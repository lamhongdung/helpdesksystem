import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/payload/User';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Save" button
  // =false: do not allow to display spinner in the "Save" button
  showSpinner: boolean;

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  userForm: FormGroup;
  user: User;

  errorMessages = {
    email: [
      { type: 'required', message: 'Please input an email' },
      { type: 'pattern', message: 'Email is incorrect format' }
    ],
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
    private formBuilder: FormBuilder,
    private notificationService: NotificationService) { }

  // this method ngOnInit() is run after the component "UserCreateComponent" is contructed
  ngOnInit(): void {

    // initial form
    this.userForm = this.formBuilder.group({

      // required and must be in correct format 
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],

      // required and max length = 50 characters
      firstName: ['', [Validators.required, Validators.maxLength(50)]],

      // required and max length = 50 characters
      lastName: ['', [Validators.required, Validators.maxLength(50)]],

      // required and length must be 10 digits
      phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],

      // max length = 100 characters
      address: ['', [Validators.maxLength(100)]],

      // initial value = 'ROLE_CUSTOMER'
      role: ['ROLE_CUSTOMER'],

      // initial value = 'Active'
      status: ['Active']
    });

  } // end of ngOnInit()

  // create user.
  // when user clicks the "Save" button in the "Create user"
  createUser() {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push into the subscriptions list in order to unsubscribes all easily
    this.subscriptions.push(

      // create user
      this.userService.createUser(this.userForm.value).subscribe({

        // create user successful
        next: (data: User) => {

          this.user = data;

          // show successful message to user 
          this.sendNotification(NotificationType.SUCCESS, `${data.lastName} ${data.firstName} is created successfully`);

          // hide spinner(circle)
          this.showSpinner = false;

          // navigate to the "user-list" page
          this.router.navigateByUrl("/user-list");
        },

        // create user failure(ex: email already existed,...)
        error: (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      })
    );

  } // end of createUser()

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

} // end of the UserCreateComponent class
