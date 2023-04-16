import { formatDate } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Editor, Toolbar } from 'ngx-editor';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { TicketStatus } from 'src/app/enum/TicketStatus';
import { CommentResponse } from 'src/app/payload/CommentResponse';
import { CustomHttpResponse } from 'src/app/payload/CustomHttpResponse';
import { TicketEditViewResponse } from 'src/app/payload/TicketEditViewResponse';
import { AuthService } from 'src/app/service/auth.service';
import { CommentService } from 'src/app/service/comment.service';
import { FileService } from 'src/app/service/file.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ShareService } from 'src/app/service/share.service';
import { TicketService } from 'src/app/service/ticket.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css']
})
export class TicketViewComponent {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Save" button
  // =false: do not allow to display spinner in the "Save" button
  showSpinner: boolean;

  // use to unsubcribe all subscribe easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  ticketForm: FormGroup;

  // ticketid
  ticketid: number;

  // all ticket status
  commentReponses: CommentResponse[] = [];

  // response data from backend
  ticketEditViewResponse: TicketEditViewResponse;

  // tooltips for "ticketForm"
  // ex:  tooltips.set('key', 'value');
  //      tooltips.get('key') --> return 'value';
  tooltips = new Map<string, string>();

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
      // priority id + priority name + resolveIn + hours
      priority: [''],
      // category id + category name
      category: [''],
      // supporter id + fullname
      assignee: [''],
      // ticketStatusid + name
      ticketStatus: ['']
      
    }); // end of initial values for "ticketForm" form

    // tooltip for "ticketStatusid" control
    this.tooltips.set("ticketStatusid", "- Ticket status.<br>- <b>Open</b>: <i>ticket has not yet assigned to supporter</i>.<br>- <b>Assigned</b>: <i>ticket has been assigned to supporter</i>.<br>- <b>Resolved</b>: <i>ticket has been resolved</i>.<br>- <b>Closed</b>: <i>ticket has been closed</i>.<br>- <b>Cancel</b>: <i>ticket has been canceled</i>.");

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

  } // end of ngOnInit()

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

  // // tooltip for explain reason why a ticket is 'on time' or 'late'
  // tooltipSlaDetail(ticketStatusid: number, createTime: Date, lastUpdateDatetime: Date,
  //   currentDatetime: Date, limitTimeToResolve: string, spentDayHhmm: string, sla: string): string {

  //   return this.shareService.tooltipSlaDetail(ticketStatusid, createTime, lastUpdateDatetime, currentDatetime,
  //     limitTimeToResolve, spentDayHhmm, sla);

  // } // end of tooltipSlaDetail()

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

} // end of the TicketViewComponent