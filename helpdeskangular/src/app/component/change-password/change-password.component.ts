import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomHttpResponse } from 'src/app/payload/CustomHttpResponse';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import { passwordValidator } from 'src/app/validator/validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Save" button
  // =false: does not allow to display spinner in the "Save" button
  showSpinner: boolean;

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // changePasswordForm has 4 fields:
  //  - Email
  //  - Old password
  //  - New password
  //  - Confirm new password
  changePasswordForm: FormGroup;

  response: CustomHttpResponse;

  // email of the logged in user
  loggedInEmail: string;

  // error messages
  errorMessages = {
    oldPassword: [
      { type: 'required', message: 'Please input old password' }
    ],
    newPassword: [
      { type: 'required', message: 'Please input new password' }
    ],
    confirmNewPassword: [
      { type: 'required', message: 'Please input Confirm new password' }
    ]
  };

  constructor(private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService) { }

  // this method ngOnInit() is run after the component "ChangePasswordComponent" is contructed
  ngOnInit(): void {

    // get email of logged in user
    this.loggedInEmail = this.authService.getEmailFromLocalStorage();

    // initial form
    this.changePasswordForm = this.formBuilder.group(
      {
        // initial value for email
        email: [this.loggedInEmail],

        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required]],
        confirmNewPassword: ['', [Validators.required]]
      },
      {
        // validate 2 fields "newPassword" and "confirmNewPassword".
        // value of "new password" must be equal to "confirm new password"
        validators: [passwordValidator]
      }
    );

  } // end of ngOnInit()

  // change password.
  // when user clicks the "Save" button in the "Change password" screen
  changePassword(): void {

    // allow display spinner icon
    this.showSpinner = true;

    // push into the subscriptions list in order to unsubscribes all easily, avoid leak memory
    this.subscriptions.push(

      // change password
      this.userService.changePassword(this.changePasswordForm.value).subscribe({

        // change password successful
        next: (response: CustomHttpResponse) => {

          this.response = response;

          // show successful message to user 
          this.sendNotification(NotificationType.SUCCESS, response.message);

          // hide spinner(circle)
          this.showSpinner = false;

          // navigate to the "ticket-list" page
          this.router.navigateByUrl("/ticket-list");
        },

        // change password failure
        error: (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      })
    );

  } // end of changePassword()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "ChangePasswordComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

} // end of the ChangePasswordComponent class
