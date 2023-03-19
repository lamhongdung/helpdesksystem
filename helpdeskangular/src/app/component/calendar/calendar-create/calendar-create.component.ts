// import { HttpErrorResponse } from '@angular/common/http';
// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { Subscription } from 'rxjs';
// import { Calendar } from 'src/app/entity/Calendar';
// import { NotificationType } from 'src/app/enum/NotificationType.enum';
// import { CalendarService } from 'src/app/service/calendar.service';
// import { NotificationService } from 'src/app/service/notification.service';

// @Component({
//   selector: 'app-calendar-create',
//   templateUrl: './calendar-create.component.html',
//   styleUrls: ['./calendar-create.component.css']
// })
// export class CalendarCreateComponent {

//    // allow display spinner icon or not
//   // =true: allow to display spinner in the "Save" button
//   // =false: do not allow to display spinner in the "Save" button
//   showSpinner: boolean;

//   // use to unsubcribe all subscribes easily, avoid leak memeory
//   subscriptions: Subscription[] = [];

//   calendarForm: FormGroup;

//   calendar: Calendar;

//   errorMessages = {
//     name: [
//       { type: 'required', message: 'Please input the first name' },
//       { type: 'maxlength', message: 'First name cannot be longer than 50 characters' },
//     ],
//     // lastName: [
//     //   { type: 'required', message: 'Please input the last name' },
//     //   { type: 'maxlength', message: 'Last name cannot be longer than 50 characters' },
//     // ],
//     // phone: [
//     //   { type: 'required', message: 'Please input phone number' },
//     //   { type: 'pattern', message: 'Phone number must be 10 digits length' }
//     // ],
//     address: [
//       { type: 'maxlength', message: 'Address cannot be longer than 300 characters' }
//     ]
//   };

//   constructor(private router: Router,
//     private calendarService: CalendarService,
//     private formBuilder: FormBuilder,
//     private notificationService: NotificationService) { }

//   // this method ngOnInit() is run after the component "UserCreateComponent" is contructed
//   ngOnInit(): void {

//     // initial form
//     this.calendarForm = this.formBuilder.group({

//       // required and max length = 50 characters
//       name: ['', [Validators.required, Validators.maxLength(50)]],

//       // // required and max length = 50 characters
//       // lastName: ['', [Validators.required, Validators.maxLength(50)]],

//       // // required and length must be 10 digits
//       // phone: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],

//       // // max length = 300 characters
//       // address: ['', [Validators.maxLength(300)]],

//       // // initial value = 'ROLE_CUSTOMER'
//       // role: ['ROLE_CUSTOMER'],

//       // initial value = 'Active'
//       status: ['Active']
//     });

//   } // end of ngOnInit()

//   // create user.
//   // when user clicks the "Save" button in the "Create user"
//   createCalendar() {

//     // allow to show spinner(circle)
//     this.showSpinner = true;

//     // push into the subscriptions list in order to unsubscribes all easily
//     this.subscriptions.push(

//       // create user
//       this.calendarService.createCalendar(this.calendarForm.value).subscribe({

//         // create user successful
//         next: (data: Calendar) => {

//           this.calendar = data;

//           // show successful message to user 
//           this.sendNotification(NotificationType.SUCCESS, `${data.name} is created successfully`);

//           // hide spinner(circle)
//           this.showSpinner = false;

//           // navigate to the "user-list" page
//           this.router.navigateByUrl("/calendar-list");
//         },

//         // create user failure(ex: email already existed,...)
//         error: (errorResponse: HttpErrorResponse) => {

//           // show the error message to user
//           this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

//           // hide spinner(circle)
//           this.showSpinner = false;
//         }
//       })
//     );

//   } // end of createUser()

//   // send notification to user
//   private sendNotification(notificationType: NotificationType, message: string): void {
//     if (message) {
//       this.notificationService.notify(notificationType, message);
//     } else {
//       this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
//     }
//   }

//   // unsubscribe all subscriptions from this component "UserComponent"
//   ngOnDestroy(): void {
//     this.subscriptions.forEach(sub => sub.unsubscribe());
//   }

// } // end of the UserCreateComponent class
  
