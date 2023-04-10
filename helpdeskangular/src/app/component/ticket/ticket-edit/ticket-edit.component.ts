import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Editor, Toolbar } from 'ngx-editor';
import { Subscription } from 'rxjs';
import { CustomHttpRespone } from 'src/app/entity/CustomHttpRespone';
import { Ticket } from 'src/app/entity/Ticket';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { TicketService } from 'src/app/service/ticket.service';

@Component({
  selector: 'app-ticket-edit',
  templateUrl: './ticket-edit.component.html',
  styleUrls: ['./ticket-edit.component.css']
})
export class TicketEditComponent {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Save" button
  // =false: do not allow to display spinner in the "Save" button
  showSpinner: boolean;

  // use to unsubcribe all subscribe easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  ticketForm: FormGroup;
  ticket: Ticket;

  // ticketid
  ticketid: number;

  // error messages
  errorMessages = {

    // lastName: [
    //   { type: 'required', message: 'Please input the last name' },
    //   { type: 'maxlength', message: 'Last name cannot be longer than 50 characters' },
    // ],
    // phone: [
    //   { type: 'required', message: 'Please input phone number' },
    //   { type: 'pattern', message: 'Phone number must be 10 digits length' }
    // ],
    // address: [
    //   { type: 'maxlength', message: 'Address cannot be longer than 300 characters' }
    // ]
  };

  // // toolbar for the "ngx-quills" rich text editor
  // modules = {
  //   toolbar: [
  //     ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  //     ['blockquote', 'code-block'],

  //     // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  //     // [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  //     // [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
  //     // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  //     // [{ 'direction': 'rtl' }],                         // text direction

  //     // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  //     // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  //     // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  //     // [{ 'font': [] }],
  //     // [{ 'align': [] }],

  //     // ['clean'],                                         // remove formatting button

  //     ['link', 'image', 'video']
  //   ],
  // }

  contentEditor: Editor;
  commentEditor: Editor;

  contentToolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    // ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    ['text_color', 'background_color'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    // ['link', 'image'],
    // ['align_left', 'align_center', 'align_right', 'align_justify'],
    // ['horizontal_rule', 'format_clear'],
  ];

  commentToolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    // ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    ['text_color', 'background_color'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    // ['link', 'image'],
    // ['align_left', 'align_center', 'align_right', 'align_justify'],
    // ['horizontal_rule', 'format_clear'],
  ];



  constructor(private router: Router,
    private ticketService: TicketService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {

  }

  // initial values
  ngOnInit(): void {

    this.contentEditor = new Editor();
    this.commentEditor = new Editor();

    this.ticketForm = this.formBuilder.group({

      // do not need validate id because this "ticketid" field is read only
      ticketid: [''],
      subject: [''],
      categoryid: [''],
      creator: [''],
      creatorPhone: [''],
      creatorEmail: [''],
      // editorMenu: [{ disabled: true }],
      content: [{ value: 'dsdsd', disabled: true }],
      comment: [''],
      // content:[''],
      team: [''],
      priorityid: [''],
      assigneeid: [''],
      ticketStatusid: [''],
      createDatetime: [''],
      lastUpdateDatetime: ['']
    });



    // get user id from params of active route(from address path).
    // and then get user based on user id from database
    this.activatedRoute.paramMap.subscribe({

      next: (params: ParamMap) => {

        // get id from param of active route.
        // The "+"" sign: convert string to number. 
        this.ticketid = +params.get('id');

        // get user by user id
        this.ticketService.findById(this.ticketid).subscribe({

          // get data successful from database
          next: (data: Ticket) => {

            this.ticket = data;

            // load user information to the userForm
            this.ticketForm.patchValue(data);

          },
          // there are some errors when get data from database
          error: (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        });
      }
    });

  } // end of ngOnInit()

  // edit user.
  // when user clicks the "Save" button in the "Edit user"
  editTicket() {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push the subscribe to a list of subscriptions in order to easily unsubscribe them when destroy the component
    this.subscriptions.push(

      // edit exsting user
      this.ticketService.editTicket(this.ticketForm.value).subscribe({

        // update user successful
        next: (data: CustomHttpRespone) => {

          // this.ticket = data;

          // send notification to user
          this.sendNotification(NotificationType.SUCCESS, data.message);

          // hide spinner(circle)
          this.showSpinner = false;

          // after update user successful then navigate to the "user-list" page
          this.router.navigateByUrl("/ticket-list");
        },
        // there are some errors when update user
        error: (errorResponse: HttpErrorResponse) => {

          // send failure message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      })
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

    this.contentEditor.destroy();
    this.commentEditor.destroy();
  }

} // end of the TicketEditComponent
