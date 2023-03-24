import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/entity/User';
import { HeaderType } from 'src/app/enum/HeaderType.enum';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ShareService } from 'src/app/service/share.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Login" button
  // =false: does not allow to display spinner in the "Login" button
  public showSpinner: boolean;

  // use to unsubcribe all subscribes easily, avoid leak memeory
  private subscriptions: Subscription[] = [];

  loginForm: FormGroup;
  user: User;

  errorMessages = {
    email: [
      { type: 'required', message: 'Please input an email' },
      { type: 'pattern', message: 'Email is incorrect format' }
    ],
    password: [
      { type: 'required', message: 'Please input a password' }
    ]
  };

  constructor(private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private shareService: ShareService) { }

  // this method is run right after component's constuctor has just finished
  ngOnInit(): void {

    // initial form
    this.loginForm = this.formBuilder.group({

      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      // email: ['', [Validators.required]],

      password: ['', [Validators.required]]

    });

    // if user already logged in before then navigate to '/ticket-list'(absoluate path)
    if (this.authService.isLoggedInUser()) {

      // navigate to '/ticket-list';
      // this.router.navigateByUrl('/ticket-list');
      this.router.navigateByUrl(this.authService.urlAfterLogin);

    } else { // if user has not yet logged in then re-direct to '/login'

      // navigate to the "/login" page
      this.router.navigateByUrl('/login');

    }
  } // end of ngOnInit()

  // when user clicks on the "Login" button
  public login(): void {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push into subscriptions[] for easy manage subscriptions.
    // when this component is to be destroy then unsubscribe all these subscriptions
    this.subscriptions.push(

      // get data from server

      // this.loginForm.value = { "email": "nguoiquantri01@gmail.com", "password": "abcxyz" }
      this.authService.login(this.loginForm.value).subscribe({

        // login success.
        // return: User and token
        next: (response: HttpResponse<User>) => {

          // get token from the header response
          const token = response.headers.get(HeaderType.JWT_TOKEN);

          // save token value into Local Storage
          this.authService.saveTokenToLocalStorage(token);

          // save user into Local Storage
          this.authService.saveUserToLocalStorage(response.body);

          // navigate to url '/ticket-list'
          // this.router.navigateByUrl('/ticket-list');
          this.router.navigateByUrl(this.authService.urlAfterLogin);

          // hide spinner(circle)
          this.showSpinner = false;

          // display the email value at the top-right corner
          this.shareService.sendClickEvent();

        },
        // login failed
        error: (errorResponse: HttpErrorResponse) => {

          // show error message
          this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner icon(circle)
          this.showSpinner = false;
        }
      })
    );
  }

  // show error message
  private sendErrorNotification(notificationType: NotificationType, message: string): void {

    // if there is message from system then use the system message
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else { // use custom message
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // this method is call right before component is destroyed.
  // avoid memeory leaks.
  ngOnDestroy(): void {
    // unsubscribe all subscription
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
