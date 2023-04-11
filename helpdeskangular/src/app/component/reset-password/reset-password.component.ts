import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomHttpRespone } from 'src/app/payload/CustomHttpRespone';
import { User } from 'src/app/payload/User';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Reset password" button
  // =false: does not allow to display spinner in the "Reset password" button
  public showSpinner: boolean;

  // use to unsubcribe all subscribes easily, avoid leak memeory
  private subscriptions: Subscription[] = [];

  // form
  resetPasswordForm: FormGroup;

  user: User;

  // error messages for validator
  errorMessages = {
    email: [
      { type: 'required', message: 'Please input an email' },
      { type: 'pattern', message: 'Email is incorrect format' }
    ]
  };

  constructor(private router: Router,
    private userService: UserService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
  ) { }

  // this method is run right after component's constuctor has just finished
  ngOnInit(): void {

    // initial form
    this.resetPasswordForm = this.formBuilder.group({

      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]

    });

  } // end of ngOnInit()

  // when user clicks on the "Reset password" button
  public resetPassword(): void {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push into subscriptions[] for easy manage subscriptions.
    // when this component is to be destroy then unsubscribe all these subscriptions
    this.subscriptions.push(

      // this.resetPasswordForm.value = { "email": "nguoiquantri@proton.me" }
      this.userService.resetPassword(this.resetPasswordForm.value).subscribe({

        // reset password success
        next: (response: CustomHttpRespone) => {

          this.showSpinner = false;
          this.sendNotification(NotificationType.SUCCESS, response.message);

          // re-direct to the '/login' page
          this.router.navigateByUrl('/login');

        },
        // there is error when reset password
        error: (error: HttpErrorResponse) => {

          this.showSpinner = false;
          this.sendNotification(NotificationType.WARNING, error.error.message);
        }
      })

    )
  } // end of resetPassword()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // this method is call right before component is destroyed.
  ngOnDestroy(): void {

    // unsubscribe all subscriptions to avoid memeory leaks.
    this.subscriptions.forEach(sub => sub.unsubscribe());

  }

}
