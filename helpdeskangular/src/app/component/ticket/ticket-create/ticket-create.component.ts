import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileItem, FileLikeObject, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { Observable, Subscription, filter } from 'rxjs';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { TicketService } from 'src/app/service/ticket.service';
import { AuthService } from 'src/app/service/auth.service';
import { ShareService } from 'src/app/service/share.service';
import { FileService } from 'src/app/service/file.service';
import { DropdownResponse } from 'src/app/payload/DropdownResponse';
import { validTicketFile } from 'src/app/validator/validator';
import { CustomHttpResponse } from 'src/app/payload/CustomHttpResponse';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Submit" button
  // =false: do not allow to display spinner in the "Submit" button
  showSpinner: boolean;

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  ticketForm: FormGroup;

  // error messages
  errorMessages = {
    subject: [
      { type: 'required', message: 'Please input a subject' },
      { type: 'maxlength', message: 'Subject cannot be longer than 60 characters' },
    ],
    content: [
      { type: 'required', message: 'Please input a content' }
    ],
    teamid: [
      { type: 'required', message: 'Please select a team' }
    ],
    categoryid: [
      { type: 'required', message: 'Please select a category' }
    ],
    priorityid: [
      { type: 'required', message: 'Please select a priority' }
    ]
  };

  editor: Editor;

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

  // user who has logged in the system
  userid: number;

  // all active teams
  teams: DropdownResponse[] = [];

  // all active categories
  categories: DropdownResponse[] = [];

  // all active priorities
  priorities: DropdownResponse[] = [];


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
  // last index of array uploader.queue.
  lastIndex: number;

  // check whether user has attached file or not?
  // - hasAttachedFile = true: user has attached file
  // - hasAttachedFile = false: user has not yet attached file
  hasAttachedFile: boolean = false;

  // customFilename = timestamp + UUID + extension(ex: .jpg)
  // ex: customFilename = "20230405143231_3ed7c8ea-114e-4c1f-a3d3-8e5a439e9aff.jpg"
  customFilename: string;

  // header data need to send to server when uploading file
  headers = [
    { name: 'Accept', value: 'application/json' },

    // authenticate with jwt
    { name: 'Authorization', value: `Bearer ${this.authService.getToken()}` }
  ];

  constructor(private router: Router,
    private ticketService: TicketService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private fileService: FileService,
    private authService: AuthService,
    private shareService: ShareService,
    private changeDetector: ChangeDetectorRef
  ) {


  }

  // this method ngOnInit() is run after the component "TicketCreateComponent" is contructed
  ngOnInit(): void {

    this.editor = new Editor();
    
    // initial form
    this.ticketForm = this.formBuilder.group(
      {
        // person creates ticket
        creatorid: [+this.authService.getIdFromLocalStorage()],

        // required and max length = 60 characters
        subject: ['', [Validators.required, Validators.maxLength(60)]],
        // required
        content: ['', [Validators.required]],
        // required
        teamid: ['', [Validators.required]],
        // required
        categoryid: ['', [Validators.required]],
        // required
        priorityid: ['', [Validators.required]],


        // check whether user has attached file or not?
        hasAttachedFile: [false],

        // customFilename = timestamp + UUID + extension(ex: .jpg)
        // ex: customFilename = "20230405143231_3ed7c8ea-114e-4c1f-a3d3-8e5a439e9aff.jpg"
        customFilename: ['']

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
        validators: [validTicketFile]
      }
    );

    // auto upload file to server after user selects a file
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

    // load posible values for dropdowns:
    //  - teams
    //  - categories
    //  - priorities
    this.loadDropdownValues();

    // last index of the valid upload file.
    // last index of array uploader.queue.
    this.lastIndex = this.uploader.queue.length > 0 ? this.uploader.queue.length - 1 : this.uploader.queue.length;

    // upload file in progress
    this.uploader.onProgressItem = (fileItem, progress) => this.onProgressItem(fileItem, progress);

    // if upload file successful
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

    // if there are errors when uploading file
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);

  } // end of ngOnInit()

  // upload file in progress
  onProgressItem(fileItem: FileItem, progress: any) {

    // render progress bar.
    // few old browsers need this command to render progress bar 
    this.changeDetector.detectChanges();

  }

  // in case upload file success
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {

    // success server response
    let data = JSON.parse(response);
    // console.log(data.customFilename);

    // has attached file
    this.ticketForm.controls['hasAttachedFile'].setValue(true);
    // set new file name
    this.ticketForm.controls['customFilename'].setValue(data.customFilename);

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

      // has no attached file
      this.ticketForm.controls['hasAttachedFile'].setValue(false);
      // customFilename = ''
      this.ticketForm.controls['customFilename'].setValue("");
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
        this.ticketForm.controls['hasAttachedFile'].setValue(false);

      } else {
        // has attached file
        this.ticketForm.controls['hasAttachedFile'].setValue(true);
      }

      // temporary set customFilename = ''
      this.ticketForm.controls['customFilename'].setValue("");

    } // end of changeFile()

    // last index of the valid upload file.
    // last index of array uploader.queue.
    // note: there are 3 cases:
    //  - press "Choose File" and press "Cancel" --> has not yet selected file
    //  - choose a valid file(file size <= maxFileSize)
    //  - choose an invalid file(file size > maxFileSize)
    this.lastIndex = this.uploader.queue.length > 0 ? this.uploader.queue.length - 1 : this.uploader.queue.length;

  } // end of changeFile()

  // initialize default values for all dropdown controls
  loadDropdownValues() {

    // load all active teams into the "Team" dropdown
    this.loadAllActiveTeams()

    // load all active categories into the "Category" dropdown
    this.loadAllActiveCategories();

    // load all acitve priorities into the "Priority" dropdown
    this.loadAllActivePriorities()

  } // end of loadDropdownValues()


  // create ticket.
  // when user clicks the "Submit" button in the "Create ticket" screen.
  // note: in case there is an attched file then 
  //        the "Submit" button will be disabled until attached file loaded 100% to server
  createTicket() {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push into the subscriptions list in order to unsubscribes all easily
    this.subscriptions.push(

      // create ticket
      this.ticketService.createTicket(this.ticketForm.value).subscribe({

        // create ticket successful
        next: (data: CustomHttpResponse) => {

          // show successful message to user 
          this.sendNotification(NotificationType.SUCCESS, data.message);

          // hide spinner(circle)
          this.showSpinner = false;

          // navigate to the "ticket-list" page
          this.router.navigateByUrl("/ticket-list");
        },

        // create ticket failure
        error: (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      })
    );

  } // end of createTicket()


  // load all active teams
  loadAllActiveTeams() {

    // push into the subscriptions array to unsubscibe them easily later
    this.subscriptions.push(

      // get all active teams
      this.ticketService.getAllActiveTeams()

        .subscribe({

          // get all active teams successful
          next: (data: DropdownResponse[]) => {

            // all active teams
            this.teams = data;

          },

          // there are some errors when get teams
          error: (errorResponse: HttpErrorResponse) => {

            // show the error message to user
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          }
        })
    );

  } // end of loadAllActiveTeams()

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

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "TicketCreateComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

} // end of the TicketCreateComponent class
