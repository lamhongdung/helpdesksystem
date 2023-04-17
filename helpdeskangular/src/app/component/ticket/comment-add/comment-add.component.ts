import { formatDate } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
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
import { validCommentFile } from 'src/app/validator/validator';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-comment-add',
  templateUrl: './comment-add.component.html',
  styleUrls: ['./comment-add.component.css']
})
export class CommentAddComponent {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Submit" button
  // =false: do not allow to display spinner in the "Submit" button
  showSpinner: boolean;

  // use to unsubcribe all subscribe easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  // comment form
  commentForm: FormGroup;

  // ticketid
  ticketid: number;

  // contains all comments by ticket id
  commentReponses: CommentResponse[] = [];

  // contain ticket information for display on screen
  ticketEditViewResponse: TicketEditViewResponse;

  // tooltips for "commentForm"
  // ex:  tooltips.set('key', 'value');
  //      tooltips.get('key') --> return 'value';
  tooltips = new Map<string, string>();

  // error messages
  errorMessages = {

    commentDescription: [
      { type: 'required', message: 'Please input a comment' }
    ]

  };

  // ticket content
  ticketEditor: Editor;

  // comment content(commentDescription)
  commentEditor: Editor;

  // toolbar of ticket content
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

  //
  // config for ng2-file-upload
  //

  // component from ng2-file-upload
  uploader: FileUploader;

  // allow to upload file up to 10MB
  maxFileSize: number = this.shareService.maxFileSize;

  // actual file size in bytes
  actualFileSize: number = 0;

  // check an uploaded file exceeds maxFileSize or not?
  // - exceedMaxFileSize = true: exceeded max allowed file size
  // - exceedMaxFileSize = false: has not yet exceeded max allowed file size
  exceedMaxFileSize: boolean = false;

  // last index of the valid upload file.
  // last index of array "uploader.queue".
  lastIndex: number;

  // check whether user has attached comment file or not?
  // - hasAttachedCommentFile = true: user has attached comment file
  // - hasAttachedCommentFile = false: user has not yet attached comment file
  hasAttachedCommentFile: boolean = false;

  // ticketCustomFilename = timestamp + UUID + extension(ex: .jpg)
  // ex: ticketCustomFilename = "20230405143231_3ed7c8ea-114e-4c1f-a3d3-8e5a439e9aff.jpg"
  ticketCustomFilename: string;

  // header data need to send to server when uploading file
  headers = [
    { name: 'Accept', value: 'application/json' },

    // authenticate with jwt
    { name: 'Authorization', value: `Bearer ${this.authService.getToken()}` }
  ];

  constructor(private router: Router,
    private ticketService: TicketService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private shareService: ShareService,
    private authService: AuthService,
    private commentService: CommentService,
    private changeDetector: ChangeDetectorRef

  ) {

  }

  // initial values
  ngOnInit(): void {

    // editor to input ticket content
    this.ticketEditor = new Editor();
    // editor to input comment description
    this.commentEditor = new Editor();

    this.commentForm = this.formBuilder.group(
      {
        // ticket id
        ticketid: [''],
        // creator id + creator fullname
        creator: [''],
        // creator phone
        creatorPhone: [''],
        // creator email
        creatorEmail: [''],
        // ticket subject
        subject: [''],

        // disable ticket content(rich text editor)
        content: [{ value: '', disabled: true }],

        // team id + team name + assignment method 
        team: [''],
        // ticket was created at this datetime
        createDatetime: [''],
        // last updated time ticket was updated
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
        ticketStatus: [''],

        // ticketCustomFilename = timestamp + UUID + extension(ex: .jpg)
        // ex: ticketCustomFilename = "20230405143231_3ed7c8ea-114e-4c1f-a3d3-8e5a439e9aff.jpg"
        ticketCustomFilename: [''],

        // user id who will add comment.
        // value must be >= 1.
        commenterid: [this.authService.getIdFromLocalStorage(), [Validators.min(1)]],

        commentDescription: ['', [Validators.required]],

        // check whether user has attached file or not?
        hasAttachedCommentFile: [false],

        commentCustomFilename: ['']

      },

      {
        //
        // check whether an attached file is valid or not?
        // This validation is only to make sure the attached file(if any) must be uploaded completely to server before
        // user press "Submit" button. 
        //
        // an attached file is consider as valid if it satisfies:
        //  - (Has no attached file) or
        //  - (Has attached file) and (this file was uploaded to server successful(customFilename != ''))
        // note: if attached file size exceeds max allowed file size then it is considered as has no attached file
        validators: [validCommentFile]
      }
    ); // end of initial values for "commentForm" form

    // upload attached file
    this.uploader = new FileUploader({

      // upload file to this endpoint
      url: `${this.ticketService.host}/upload?file`,

      method: "POST",

      // auto upload file to server after user selects a file
      autoUpload: true,

      isHTML5: true,

      // authenticate with jwt
      headers: this.headers,

      // max file size = 10 MB.
      // if fileSize > 10 MB then system will block file and will not upload the file to the system
      maxFileSize: this.maxFileSize

    });

    // last index of the valid upload file.
    // last index of array uploader.queue.
    this.lastIndex = this.uploader.queue.length > 0 ? this.uploader.queue.length - 1 : this.uploader.queue.length;

    // upload file in progress
    this.uploader.onProgressItem = (fileItem, progress) => this.onProgressItem(fileItem, progress);

    // if upload file successful
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

    // if there are errors when uploading file
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);


    // tooltip for "ticketStatusid" control
    this.tooltips.set("ticketStatusid", "- Ticket status.<br>- <b>Open</b>: <i>ticket has not yet assigned to supporter</i>.<br>- <b>Assigned</b>: <i>ticket has been assigned to supporter</i>.<br>- <b>Resolved</b>: <i>ticket has been resolved</i>.<br>- <b>Closed</b>: <i>ticket has been closed</i>.<br>- <b>Cancel</b>: <i>ticket has been canceled</i>.");

    // get ticket id from params of active route(from address bar).
    // and then get ticket content based on ticket id from database
    this.activatedRoute.paramMap.subscribe({

      next: (params: ParamMap) => {

        // get ticket id from param of active route.
        // The "+"" sign: convert string to number. 
        this.ticketid = +params.get('ticketid');

        // get ticket by ticket id
        this.ticketService.findById(this.ticketid).subscribe({

          // get ticket content successful from database
          next: (data: TicketEditViewResponse) => {

            this.ticketEditViewResponse = data;

            // if ticket status is 'Closed' or 'Cancel' then navigate to 'ticket-list' screen.
            // avoid user tricks by manually input ticket id for 'Closed'/'Cancel' tickets in adrress bar
            if (this.ticketEditViewResponse.ticketStatusid == TicketStatus.Closed ||
              this.ticketEditViewResponse.ticketStatusid == TicketStatus.Cancel) {

              // navigate to the "/ticket-list" page
              this.router.navigateByUrl('/ticket-list');

            }

            // load ticket information to the commentForm
            this.commentForm.patchValue(data);

            // convert UTC to local time
            this.commentForm.get("createDatetime").patchValue(
              formatDate(data.createDatetime.toLocaleString(), "yyyy-MM-dd HH:mm:ss", "en-US"));
            this.commentForm.get("lastUpdateDatetime").patchValue(
              formatDate(data.lastUpdateDatetime.toLocaleString(), "yyyy-MM-dd HH:mm:ss", "en-US"));

          },

          // there are some errors when get ticket content by ticket id
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

      // there are some errors when get ticket id from address bar
      error: (errorResponse: HttpErrorResponse) => {

        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

      }

    });


  } // end of ngOnInit()


  // upload file in progress
  onProgressItem(fileItem: FileItem, progress: any) {

    // render progress bar.
    // few old browsers need this command to render progress bar 
    this.changeDetector.detectChanges();

  }

  // in case upload comment file success
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {

    // success server response
    let data = JSON.parse(response);

    // has attached comment file
    this.commentForm.controls['hasAttachedCommentFile'].setValue(true);
    // set new file name
    this.commentForm.controls['commentCustomFilename'].setValue(data.customFilename);

  } // end of onSuccessItem()

  // in case upload file failure
  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {

    // failure server response
    let error = JSON.parse(response);

    // show the error message to user
    this.sendNotification(NotificationType.ERROR, error.message);

    // hide spinner(circle)
    this.showSpinner = false;

  } // end of onErrorItem()

  // fires when user changes file at the "Choose File" button
  changeFile(event: any) {

    // if user presses the "Choose File" button but user did not select any file.
    // There is no attached file
    if (event.target.files[0] === undefined) {

      // has no attached comment file
      this.commentForm.controls['hasAttachedCommentFile'].setValue(false);
      // commentCustomFilename = ''
      this.commentForm.controls['commentCustomFilename'].setValue("");
      // actual file size
      this.actualFileSize = 0
      // does not exceeds maxFileSize
      this.exceedMaxFileSize = false;

    } else {

      // actual uploaded file size in bytes
      this.actualFileSize = event.target.files[0]?.size;

      // check if the uploaded file exceeds max allowed file size or not?
      this.exceedMaxFileSize = (event.target.files[0]?.size > this.maxFileSize);

      // if actual file size exceeds max file size
      if (this.exceedMaxFileSize) {
        // has no attached file
        this.commentForm.controls['hasAttachedCommentFile'].setValue(false);

      } else {
        // has attached file
        this.commentForm.controls['hasAttachedCommentFile'].setValue(true);
      }

      // temporary set commentCustomFilename = ''
      this.commentForm.controls['commentCustomFilename'].setValue("");

    } // end of changeFile()

    // last index of the valid upload file.
    // last index of array uploader.queue.
    // note: there are 3 cases:
    //  - press "Choose File" and press "Cancel" --> has not yet selected file
    //  - choose a valid file(file size <= maxFileSize)
    //  - choose an invalid file(file size > maxFileSize)
    this.lastIndex = this.uploader.queue.length > 0 ? this.uploader.queue.length - 1 : this.uploader.queue.length;

  } // end of changeFile()


  // submit comment.
  // when user clicks the "Submit" button in the "Add comment"
  addComment() {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push the subscribe to a list of subscriptions in order to easily unsubscribe them when destroy the component
    this.subscriptions.push(

      // add comment
      this.commentService.addComment(this.commentForm.value).subscribe({

        // add comment successful
        next: (data: CustomHttpResponse) => {

          // send notification to user
          this.sendNotification(NotificationType.SUCCESS, data.message);

          // hide spinner(circle)
          this.showSpinner = false;

          // after save comment successful then navigate to the "ticket-list" page
          // this.router.navigateByUrl("/ticket-list");
          this.ngOnInit();

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

  } // end of addComment()


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

    this.ticketEditor.destroy();
    this.commentEditor.destroy();
  }

} // end of the TicketEditComponent
