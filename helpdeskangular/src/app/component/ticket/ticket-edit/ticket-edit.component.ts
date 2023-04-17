import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Editor, Toolbar } from 'ngx-editor';
import { Observable, Subscription } from 'rxjs';
import { CustomHttpResponse } from 'src/app/payload/CustomHttpResponse';
import { TicketEditViewResponse } from 'src/app/payload/TicketEditViewResponse';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { TicketService } from 'src/app/service/ticket.service';
import { formatDate } from '@angular/common';
import { DropdownResponse } from 'src/app/payload/DropdownResponse';
import { FileService } from 'src/app/service/file.service';
import { saveAs } from 'file-saver';
import { TicketStatus } from 'src/app/enum/TicketStatus';
import { AuthService } from 'src/app/service/auth.service';
import { ShareService } from 'src/app/service/share.service';
import { CommentService } from 'src/app/service/comment.service';
import { CommentResponse } from 'src/app/payload/CommentResponse';

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

  // ticketid
  ticketid: number;

  // all active priorities
  priorities: DropdownResponse[] = [];

  // all active categories
  categories: DropdownResponse[] = [];

  // all active supporters
  assignees: DropdownResponse[] = [];

  // all ticket status
  ticketStatus: DropdownResponse[] = [];

  // all ticket status
  commentReponses: CommentResponse[] = [];

  // response data from backend
  ticketEditViewResponse: TicketEditViewResponse;

  // tooltips for "ticketForm"
  // ex:  tooltips.set('key', 'value');
  //      tooltips.get('key') --> return 'value';
  tooltips = new Map<string, string>();

  // error messages
  errorMessages = {

    priorityid: [
      { type: 'required', message: 'Please select a priority' },
      { type: 'min', message: 'Value of priority id must be greater than or equal to 1' }
    ],
    categoryid: [
      { type: 'required', message: 'Please select a category' },
      { type: 'min', message: 'Value of category id must be greater than or equal to 1' }
    ],
    assigneeid: [
      { type: 'required', message: 'Please select an assignee' },
      { type: 'min', message: 'Value of assignee id must be greater than or equal to 1' }
    ],
    ticketStatusid: [
      { type: 'required', message: 'Please select a status' },
      { type: 'min', message: 'Value of ticket status id must be greater than or equal to 1' }
    ]
  };

  // Rich text editor contains ticket content
  editor: Editor;

  // toolbar of rich text editor
  toolbar: Toolbar = [
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
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private shareService: ShareService,
    private authService: AuthService,
    private commentService: CommentService

  ) {

  }

  // initial values
  ngOnInit(): void {

    // 
    this.editor = new Editor();

    this.ticketForm = this.formBuilder.group({

      ticketid: [''],
      // creator id + creator fullname
      creator: [''],

      creatorPhone: [''],
      creatorEmail: [''],
      subject: [''],

      // disable ticket content(rich text editor)
      content: [{ value: '', disabled: true }],

      // team id + team name + assignment method 
      team: [''],
      // ticket was created on this datetime
      createDatetime: [''],
      // last time ticket was updated
      lastUpdateDatetime: [''],
      // user id + fullname
      lastUpdateByUser: [''],
      // spent hours + SLA.
      // ex: "29 days 5 hours 46 minutes  --> Late"
      spentHour: [''],
      // required and value must be >= 1
      priorityid: ['', [Validators.required, Validators.min(1)]],
      // required and value must be >= 1
      categoryid: ['', [Validators.required, Validators.min(1)]],
      // required and value must be >= 1
      assigneeid: ['', [Validators.required, Validators.min(1)]],
      // required and value must be >= 1
      ticketStatusid: ['', [Validators.required, Validators.min(1)]],

      // user id who will update ticket.
      // value must be >= 1.
      toBeUpdatedByUserid: [this.authService.getIdFromLocalStorage(), [Validators.min(1)]]

    }); // end of initial values for "ticketForm" form

    // tooltip for "ticketStatusid" control
    this.tooltips.set("ticketStatusid", "- Ticket status.<br>- <b>Open</b>: <i>ticket has not yet assigned to supporter</i>.<br>- <b>Assigned</b>: <i>ticket has been assigned to supporter</i>.<br>- <b>Resolved</b>: <i>ticket has been resolved</i>.<br>- <b>Closed</b>: <i>ticket has been closed</i>.<br>- <b>Cancel</b>: <i>ticket has been canceled</i>.");

    // get ticket id from params of active route(from address bar).
    // and then get ticket based on ticket id from database
    this.activatedRoute.paramMap.subscribe({

      next: (params: ParamMap) => {

        // get id from param of active route.
        // The "+"" sign: convert string to number. 
        this.ticketid = +params.get('id');

        // get ticket by ticket id
        this.ticketService.findById(this.ticketid).subscribe({

          // get data successful from database
          next: (data: TicketEditViewResponse) => {

            this.ticketEditViewResponse = data;

            // if ticket status is 'Closed' or 'Cancel' then navigate to 'ticket-list' screen.
            // avoid user tricks by manually input ticket id for 'Closed'/'Cancel' tickets in adrress bar
            if (this.ticketEditViewResponse.ticketStatusid == TicketStatus.Closed ||
              this.ticketEditViewResponse.ticketStatusid == TicketStatus.Cancel) {

              // navigate to the "/ticket-list" page
              this.router.navigateByUrl('/ticket-list');

            }

            // load ticket information to the ticketForm
            this.ticketForm.patchValue(data);

            // convert UTC to local time
            this.ticketForm.get("createDatetime").patchValue(
              formatDate(data.createDatetime.toLocaleString(), "yyyy-MM-dd HH:mm:ss", "en-US"));
            this.ticketForm.get("lastUpdateDatetime").patchValue(
              formatDate(data.lastUpdateDatetime.toLocaleString(), "yyyy-MM-dd HH:mm:ss", "en-US"));


          },

          // there are some errors when get ticket by ticket id
          error: (errorResponse: HttpErrorResponse) => {

            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        }); // end of this.ticketService.findById()

        // get all comments by ticket id
        this.commentService.getAllCommentsByTicketid(this.ticketid).subscribe({

          // get all comments successful from database
          next: (data: CommentResponse[]) => {

            this.commentReponses = data;

          },

          // there are some errors when get comments from database
          error: (errorResponse: HttpErrorResponse) => {

            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        }); // end of this.commentService.getAllCommentsByTicketid()

      },

      // there are some errors when get id from address bar
      error: (errorResponse: HttpErrorResponse) => {

        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

      }

    });

    // load values for 4 dropdowns "Priority", "Category", "Assignee", "Ticket status"
    this.loadDropdownValues();

  } // end of ngOnInit()

  // load values for 4 dropdowns "Priority", "Category", "Assignee", "Ticket status"
  loadDropdownValues() {

    // load all acitve priorities into the "Priority" dropdown
    this.loadAllActivePriorities()

    // load all active categories into the "Category" dropdown
    this.loadAllActiveCategories();

    // load active supporters belong team into the "Assignee" dropdown
    this.loadActiveSupportersBelongTeam(this.ticketid);

    // load next appropriate ticket status into the "Ticket status" dropdown
    this.loadNextTicketStatus(this.ticketid);

  } // end of loadDropdownValues()

  // edit user.
  // when user clicks the "Save" button in the "Edit user"
  editTicket() {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push the subscribe to a list of subscriptions in order to easily unsubscribe them when destroy the component
    this.subscriptions.push(

      // edit exsting user
      this.ticketService.editTicket(this.ticketForm.value).subscribe({

        // update ticket successful
        next: (data: CustomHttpResponse) => {

          // send notification to user
          this.sendNotification(NotificationType.SUCCESS, data.message);

          // hide spinner(circle)
          this.showSpinner = false;

          // after update ticket successful then navigate to the "ticket-list" page
          this.router.navigateByUrl("/ticket-list");

        },

        // there are some errors when update ticket
        error: (errorResponse: HttpErrorResponse) => {

          // send failure message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      })

    );

  } // end of editTicket()

  // load all active categories
  loadAllActiveCategories() {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get all active categories
      this.ticketService.getAllActiveCategories().subscribe({

        // get all active categories successful
        next: (data: DropdownResponse[]) => {

          // all active categories
          this.categories = data;

        },

        // there are some errors when get categories
        error: (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

        }
      })
    );

  } // end of loadAllActiveCategories()

  // load all active priorities
  loadAllActivePriorities() {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get all active priorities
      this.ticketService.getAllActivePriorities().subscribe({

        // get all active priorities successful
        next: (data: DropdownResponse[]) => {

          // all active priorities
          this.priorities = data;

        },

        // there are some errors when get priorities
        error: (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

        }
      })
    );

  } // end of loadAllActivePriorities()

  // load active supporters belong team
  loadActiveSupportersBelongTeam(ticketid: number) {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get active supporters belong team
      this.ticketService.getActiveSupportersBelongTeam(ticketid).subscribe({

        // get active supporters belong team successful
        next: (data: DropdownResponse[]) => {

          // active supporters belong team
          this.assignees = data;

        },

        // there are some errors when get active supporters
        error: (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

        }
      })
    );

  } // end of loadActiveSupportersBelongTeam()

  // load next appropriate ticket status
  loadNextTicketStatus(ticketid: number) {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get next appropriate ticket status 
      this.ticketService.getNextTicketStatus(ticketid).subscribe({

        // get next appropriate ticket status successful
        next: (data: DropdownResponse[]) => {

          // next ticket status
          this.ticketStatus = data;

        },

        // there are some errors when get ticket status
        error: (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

        }
      })
    );

  } // end of loadNextTicketStatus()

  // download file from server
  downloadFile(customFilename: string): void {

    this.fileService.download(customFilename).subscribe({


      next: (httpEvent: HttpEvent<Blob>) => {

        // if file has commpleted download from server
        if (httpEvent.type == HttpEventType.Response) {

          // save file to local computer
          saveAs(new File([httpEvent.body!],
            // file name after download
            httpEvent.headers.get('originalFilename')!,
            { type: `${httpEvent.headers.get('Content-Type')};charset=utf-8` }));

        }

      },

      error: (errorResponse: HttpErrorResponse) => {

        // show the error message to user
        // this.sendNotification(NotificationType.ERROR, errorResponse.message);
        this.sendNotification(NotificationType.ERROR, "File has not found on server!");

      }

    });

  } // end of downloadFile()

  // tooltip for explain reason why a ticket is 'on time' or 'late'
  tooltipSlaDetail(ticketStatusid: number, createTime: Date, lastUpdateDatetime: Date,
    currentDatetime: Date, limitTimeToResolve: string, spentDayHhmm: string, sla: string): string {

    return this.shareService.tooltipSlaDetail(ticketStatusid, createTime, lastUpdateDatetime, currentDatetime,
      limitTimeToResolve, spentDayHhmm, sla);

  } // end of tooltipSlaDetail()

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

    this.editor.destroy();
  }

} // end of the TicketEditComponent
