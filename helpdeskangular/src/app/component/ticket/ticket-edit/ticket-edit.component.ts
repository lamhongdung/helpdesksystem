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

  ticketEditViewResponse: TicketEditViewResponse;

  fileStatus = { status: '', requestType: '', percent: 0 };

  // tooltips for "Search form" and "table"
  // ex:  tooltips.set('key', 'value');
  //      tooltips.get('key') --> return 'value';
  tooltips = new Map<string, string>();

  htmlContent = '<h1>hello</h1>';

  // error messages
  errorMessages = {

    priorityid: [
      { type: 'required', message: 'Please select a priority' }
    ],
    categoryid: [
      { type: 'required', message: 'Please select a category' }
    ],
    assigneeid: [
      { type: 'required', message: 'Please select an assignee' },
      { type: 'min', message: 'Please select an assignee' }
    ],
    ticketStatusid: [
      { type: 'required', message: 'Please select a status' }
    ]
  };

  editor: Editor;
  // commentEditor: Editor;

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

  // commentToolbar: Toolbar = [
  //   ['bold', 'italic'],
  //   ['underline', 'strike'],
  //   // ['code', 'blockquote'],
  //   ['ordered_list', 'bullet_list'],
  //   ['text_color', 'background_color'],
  //   [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  //   // ['link', 'image'],
  //   // ['align_left', 'align_center', 'align_right', 'align_justify'],
  //   // ['horizontal_rule', 'format_clear'],
  // ];



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

    this.editor = new Editor();

    this.ticketForm = this.formBuilder.group({

      ticketid: [''],
      // creator id + creator fullname
      creator: [''],

      creatorPhone: [''],
      creatorEmail: [''],
      subject: [''],
      content: [{ value: '', disabled: true }],

      // team id + team name
      team: [''],
      createDatetime: [''],
      lastUpdateDatetime: [''],
      // user id + fullname
      lastUpdateByUser: [''],
      // spent hours + SLA
      spentHour: [''],
      priorityid: ['', [Validators.required, Validators.min(1)]],
      categoryid: ['', [Validators.required, Validators.min(1)]],
      assigneeid: ['', [Validators.required, Validators.min(1)]],
      ticketStatusid: ['', [Validators.required, Validators.min(1)]],
      toBeUpdatedByUserid: [this.authService.getIdFromLocalStorage(),[Validators.min(1)]]
    });

    this.tooltips.set("ticketStatusid", "- Ticket status.<br>- <b>Open</b>: ticket has not yet assigned to supporter.<br>- <b>Assigned</b>: ticket has been assigned to supporter.<br>- <b>Resolved</b>: ticket has been resolved.<br>- <b>Closed</b>: ticket has been closed.<br>- <b>Cancel</b>: ticket has been canceled.");

    // get ticket id from params of active route(from address path).
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

            // console.log(this.ticketEditViewResponse.ticketStatusid);
            // console.log(this.ticketEditViewResponse.ticketStatusid == 4);

            if (this.ticketEditViewResponse.ticketStatusid == TicketStatus.Closed ||
              this.ticketEditViewResponse.ticketStatusid == TicketStatus.Cancel) {
              // if (true){
              // navigate to the "/ticket-list" page
              this.router.navigateByUrl('/ticket-list');
            }

            // load ticket information to the ticketForm
            this.ticketForm.patchValue(data);
            this.ticketForm.get("createDatetime").patchValue(formatDate(data.createDatetime.toLocaleString(), "yyyy-MM-dd HH:mm:ss", "en-US"));
            this.ticketForm.get("lastUpdateDatetime").patchValue(formatDate(data.lastUpdateDatetime.toLocaleString(), "yyyy-MM-dd HH:mm:ss", "en-US"));


          },
          // there are some errors when get data from database
          error: (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        });

        this.commentService.getAllCommentsByTicketid(this.ticketid).subscribe({

          // get data successful from database
          next: (data: CommentResponse[]) => {

            this.commentReponses = data;

          },
          // there are some errors when get data from database
          error: (errorResponse: HttpErrorResponse) => {
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          }
        });

      }
    });

    // this.userid = +this.authService.getIdFromLocalStorage();

    this.loadDropdownValues();



  } // end of ngOnInit()

  // initialize default values for all dropdown controls
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

        // update user successful
        next: (data: CustomHttpResponse) => {

          // this.ticket = data;

          // send notification to user
          this.sendNotification(NotificationType.SUCCESS, data.message);

          // hide spinner(circle)
          this.showSpinner = false;

          // after update user successful then navigate to the "ticket-list" page
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

  // load all active categories
  loadAllActiveCategories() {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get all active categories
      this.ticketService.getAllActiveCategories()

        .subscribe({

          // get all active categories successful
          next: (data: DropdownResponse[]) => {

            // all active categories
            this.categories = data;

          },

          // there are some errors when get teams
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
      this.ticketService.getAllActivePriorities()

        .subscribe({

          // get all active priorities successful
          next: (data: DropdownResponse[]) => {

            // all active priorities
            this.priorities = data;

          },

          // there are some errors when get teams
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
      this.ticketService.getActiveSupportersBelongTeam(ticketid)

        .subscribe({

          // get active supporters belong team successful
          next: (data: DropdownResponse[]) => {

            // active supporters belong team
            this.assignees = data;

          },

          // there are some errors when get teams
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
      this.ticketService.getNextTicketStatus(ticketid)

        .subscribe({

          // get next appropriate ticket status successful
          next: (data: DropdownResponse[]) => {

            // next ticket status
            this.ticketStatus = data;

          },

          // there are some errors when get teams
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    );

  } // end of loadActiveSupportersBelongTeam()

  // define a function to download files
  onDownloadFile(customFilename: string): void {

    this.fileService.download(customFilename).subscribe({

      next: (event) => {
        // console.log(event);
        this.resportProgress(event);
      },
      error: (errorResponse: HttpErrorResponse) => {
        // error: (errorResponse: CustomHttpResponse) => {
        console.log("There is error!");
        console.log(errorResponse);
        // show the error message to user
        // this.sendNotification(NotificationType.ERROR, errorResponse.message);
        this.sendNotification(NotificationType.ERROR, "File has not found on server!");
      }
    });
  }

  private resportProgress(httpEvent: HttpEvent<Blob>): void {

    switch (httpEvent.type) {

      // case HttpEventType.DownloadProgress:
      //   this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Downloading... ');
      //   break;

      // case HttpEventType.ResponseHeader:
      //   console.log('Header returned', httpEvent);
      //   break;

      case HttpEventType.Response:

        saveAs(new File([httpEvent.body!], httpEvent.headers.get('originalFilename')!,
          { type: `${httpEvent.headers.get('Content-Type')};charset=utf-8` }));
        this.fileStatus.status = 'done';

        break;

      default:
        // console.log(httpEvent);
        break;

    }
  }

  // private updateStatus(loaded: number, total: number, requestType: string): void {
  //   this.fileStatus.status = 'progress';
  //   this.fileStatus.requestType = requestType;
  //   this.fileStatus.percent = Math.round(100 * loaded / total);
  // }

  // display reason why a ticket is 'on time' or 'late'
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
    // this.commentEditor.destroy();
  }

} // end of the TicketEditComponent
