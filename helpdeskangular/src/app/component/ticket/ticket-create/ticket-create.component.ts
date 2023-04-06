import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileItem, FileLikeObject, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { Observable, Subscription, filter } from 'rxjs';
import { Ticket } from 'src/app/entity/Ticket';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { TicketService } from 'src/app/service/ticket.service';
import { AuthService } from 'src/app/service/auth.service';
import { ShareService } from 'src/app/service/share.service';
import { CustomHttpRespone } from 'src/app/entity/CustomHttpRespone';
import { FileService } from 'src/app/service/file.service';

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent {

  //
  // constants
  //
  NO_ATTACHED_FILE: number = 1;
  HAS_ATTACHED_FILE: number = 2;


  // allow display spinner icon or not
  // =true: allow to display spinner in the "Submit" button
  // =false: do not allow to display spinner in the "Submit" button
  showSpinner: boolean;

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  ticketForm: FormGroup;
  ticket: Ticket;

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


  // toolbar for the "ngx-quills" rich text editor
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      ['link', 'image', 'video']
    ],
  }

  // selectedFiles?: FileList;
  // currentFile?: File;
  // progress = 0;
  // message = '';

  // fileInfos?: Observable<any>;

  //
  // config for ng2-file-upload
  //

  maxFileSize: number = this.shareService.maxFileSize;

  isExceedMaxFileSize: boolean = false;

  // upload component from ng2-file-upload
  uploader: FileUploader;

  fileUploadResponse: string;

  lastIndex: number;

  fileUploadStatus: number;

  // isSelectedFile: boolean = false;

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

    // initial form
    this.ticketForm = this.formBuilder.group({

      // required and max length = 60 characters
      subject: ['', [Validators.required, Validators.maxLength(60)]],
      // required
      content: ['', [Validators.required]],
      // required
      teamid: ['', [Validators.required]],
      // required
      categoryid: ['', [Validators.required]],
      // required
      priorityid: ['', [Validators.required]]

    });

    // auto upload file to server after user selects a file
    this.uploader = new FileUploader({

      url: `${this.ticketService.host}/upload?file`,
      method: "POST",
      // auto upload file to server after user selects a file
      autoUpload: true,
      isHTML5: true,

      // removeAfterUpload: true,

      headers: this.headers,

      // max file size = 10 MB
      maxFileSize: this.maxFileSize
    });

    this.fileUploadResponse = '';

    this.uploader.response.subscribe(res => this.fileUploadResponse = res);

    this.lastIndex = this.uploader.queue.length > 0 ? this.uploader.queue.length - 1 : this.uploader.queue.length;
    // this.isSelectedFile = true;

    // if there are errors when uploading file
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);

    // if upload file successful
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

    this.uploader.onProgressItem = (fileItem, progress) => this.onProgressItem(fileItem, progress);

    // this.uploader.onProgressItem = (progress: any) => {
    //   console.log('onProgressItem : ' + progress['progress']);
    //   // this.changeDetector.detectChanges();
    // };

    // this.uploader.onBeforeUploadItem = (fileItem) => this.onBeforeUploadItem(fileItem);

  } // end of ngOnInit()

  // in case upload file success
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    // let data = JSON.parse(response); //success server response
    let data = JSON.parse(this.fileUploadResponse); //success server response
    console.log(this.fileUploadResponse);
    console.log(data.message);
    // this.uploader.clearQueue();

  }

  // in case upload file failure
  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    // let error = JSON.parse(response); //error server response
    // console.log(error);
    // console.log(response);
    console.log(this.fileUploadResponse);
  }

  onProgressItem(fileItem: FileItem, progress: any) {
    console.log(this.uploader.progress);
    this.changeDetector.detectChanges();
  }

  // onAfterAddingFile(fileItem: FileItem): any {
  //   console.log("onAfterAddingFile:");

  // }

  // onBeforeUploadItem(fileItem: FileItem): any {
  //   console.log("onBeforeUploadItem:" + ((fileItem._file.size / 1024) / 1024) + " MB");

  //   if (fileItem._file.size > this.maxFileSize) {
  //     console.log("exceeds file size");
  //   }
  //   else {
  //     console.log("file size is valid");
  //   }

  // }

  // onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any): any {
  //   console.log("onWhenAddingFileFailed");
  // }

  changeFile(event: any) {

    if (event.target.files[0] === undefined){
      this.fileUploadStatus = this.NO_ATTACHED_FILE;
    }else{
      
      this.fileUploadStatus = this.HAS_ATTACHED_FILE;
    }

    // this.uploader.progress = 0;
    // this.uploader.clearQueue();
    this.lastIndex = this.uploader.queue.length > 0 ? this.uploader.queue.length - 1 : this.uploader.queue.length;

    // console.log(event);
    console.log(event.target.files[0]?.name);
    console.log(event.target.files[0]?.size);
    console.log(event.target.files[0]);
    console.log("fileUploadStatus:" + this.fileUploadStatus);

    this.isExceedMaxFileSize = (event.target.files[0]?.size > this.maxFileSize);

    if (event.target.files[0]?.size > this.maxFileSize) {
      console.log(event.target.files[0]?.size + " exceeds file size");
      
    }
    else {
      console.log("file size is valid");
    }

    console.log("------")
  }



  // selectFile(event: any): void {
  //   this.selectedFiles = event.target.files;
  // }

  // upload(): void {
  //   this.progress = 0;

  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);

  //     if (file) {
  //       this.currentFile = file;

  //       this.fileService.upload(this.currentFile).subscribe({
  //         next: (event: any) => {
  //           if (event.type === HttpEventType.UploadProgress) {
  //             this.progress = Math.round(100 * event.loaded / event.total);
  //           } else if (event instanceof HttpResponse) {
  //             this.message = event.body.message;
  //             this.fileInfos = this.fileService.getFiles();
  //           }
  //         },
  //         error: (err: any) => {
  //           console.log(err);
  //           this.progress = 0;

  //           if (err.error && err.error.message) {
  //             this.message = err.error.message;
  //           } else {
  //             this.message = 'Could not upload the file!';
  //           }

  //           this.currentFile = undefined;
  //         }
  //       });
  //     }

  //     this.selectedFiles = undefined;
  //   }
  // }


  // create ticket.
  // when user clicks the "Submit" button in the "Create ticket"
  createTicket() {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push into the subscriptions list in order to unsubscribes all easily
    this.subscriptions.push(

      // create ticket
      this.ticketService.createTicket(this.ticketForm.value).subscribe({

        // create user successful
        next: (data: Ticket) => {

          this.ticket = data;

          // show successful message to user 
          this.sendNotification(NotificationType.SUCCESS, `Ticket is created successfully`);

          // hide spinner(circle)
          this.showSpinner = false;

          // navigate to the "user-list" page
          this.router.navigateByUrl("/ticket-list");
        },

        // create user failure(ex: email already existed,...)
        error: (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      })
    );

  } // end of createUser()

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
  }

} // end of the UserCreateComponent class
