import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomHttpRespone } from 'src/app/entity/CustomHttpRespone';
import { EditProfile } from 'src/app/entity/EditProfile';
import { User } from 'src/app/entity/User';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Save" button
  // =false: does not allow to display spinner in the "Save" button
  showSpinner: boolean;

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // editProfileForm has 5 fields:
  //  - id: do not show to user
  //  - Email
  //  - First name
  //  - Last name
  //  - Phone
  //  - Address
  editProfileForm: FormGroup;

  editProfile: EditProfile;

  response: CustomHttpRespone;

  // email of the logged in user
  loggedInEmail: string;

  // id of the logged in user
  userId: number

  // role
  userRole: string;

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
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService) { }

  // this method ngOnInit() is run after the component "EditProfileComponent" is contructed
  ngOnInit(): void {

    // get email of the logged in user
    this.loggedInEmail = this.authService.getEmailFromLocalStorage();

    // get user id of the logged in user.
    // the "+" sign: use to convert string to number
    this.userId = +this.authService.getIdFromLocalStorage();

    // get user role
    this.userRole = this.authService.getRoleFromLocalStorage();

    // initial form
    this.editProfileForm = this.formBuilder.group(
      {
        id: [''],

        // initial value for email
        // email: [this.loggedInEmail],
        email: [''],

        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.maxLength(50)]],
        phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
        address: ['', [Validators.maxLength(300)]],
      }
    );

    // get user by user id
    this.userService.findById(this.userId).subscribe({

      next: (data: User) => {

        // create new editProfile
        this.editProfile = new EditProfile(+data.id, data.email, data.firstName, data.lastName, data.phone, data.address);

        // load user information to the editProfileForm
        this.editProfileForm.patchValue(this.editProfile);
        // this.editProfileForm.patchValue(data);

      },
      // there are some errors when get user from database 
      error: (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    });

  } // end of ngOnInit()

  // update profile.
  // when user clicks the "Save" button in the "Edit profile" screen
  updateProfile(): void {

    // allow display spinner icon
    this.showSpinner = true;

    // push into the subscriptions list in order to unsubscribes all easily, avoid leak memory
    this.subscriptions.push(

      // update profile
      this.userService.updateProfile(this.editProfileForm.value).subscribe({

        // update profile successful
        next: (user: User) => {

          // show successful message to user 
          this.sendNotification(NotificationType.SUCCESS, `${user.lastName} ${user.firstName} is updated successfully`);

          // hide spinner(circle)
          this.showSpinner = false;

          // if user role is "Admin" then re-direct to "/user-list".
          // note: ===: do not auto convert type before compare
          if (this.userRole === "ROLE_ADMIN") {
            this.router.navigateByUrl("/user-list");
          } else { // if user role is "Customer" or "Supporter"
            // re-direct to the "ticket-list" page
            this.router.navigateByUrl("/ticket-list");
          }

        },

        // update profile failure
        error: (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      })
    );

  } // end of updateProfile()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "EditProfileComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

} // end of the EditProfileComponent class
