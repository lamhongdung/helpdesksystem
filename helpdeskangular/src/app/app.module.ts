import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TooltipModule } from 'ng2-tooltip-directive';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryCreateComponent } from './component/category/category-create/category-create.component';
import { CategoryEditComponent } from './component/category/category-edit/category-edit.component';
import { CategoryListComponent } from './component/category/category-list/category-list.component';
import { CategoryViewComponent } from './component/category/category-view/category-view.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { EditProfileComponent } from './component/edit-profile/edit-profile.component';
import { HeaderComponent } from './component/header/header.component';
import { LoginComponent } from './component/login/login.component';
import { PriorityCreateComponent } from './component/priority/priority-create/priority-create.component';
import { PriorityEditComponent } from './component/priority/priority-edit/priority-edit.component';
import { PriorityListComponent } from './component/priority/priority-list/priority-list.component';
import { PriorityViewComponent } from './component/priority/priority-view/priority-view.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { TeamCreateComponent } from './component/team/team-create/team-create.component';
import { TeamEditComponent } from './component/team/team-edit/team-edit.component';
import { TeamListComponent } from './component/team/team-list/team-list.component';
import { TeamViewComponent } from './component/team/team-view/team-view.component';
import { TicketCreateComponent } from './component/ticket/ticket-create/ticket-create.component';
import { TicketListComponent } from './component/ticket/ticket-list/ticket-list.component';
import { UserCreateComponent } from './component/user/user-create/user-create.component';
import { UserEditComponent } from './component/user/user-edit/user-edit.component';
import { UserListComponent } from './component/user/user-list/user-list.component';
import { UserViewComponent } from './component/user/user-view/user-view.component';
import { AuthGuard } from './guard/auth.guard';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { NotificationModule } from './notification.module';
import { AuthService } from './service/auth.service';
import { NotificationService } from './service/notification.service';
import { UserService } from './service/user.service';
import { TicketViewComponent } from './component/ticket/ticket-view/ticket-view.component';
import { TicketEditComponent } from './component/ticket/ticket-edit/ticket-edit.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { FileUploadModule } from 'ng2-file-upload';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { QuillModule } from 'ngx-quill';
import { NgxEditorModule } from 'ngx-editor';
import { CommentAddComponent } from './component/ticket/comment-add/comment-add.component';
import { WorkloadReportComponent } from './component/report/workload-report/workload-report.component';
import { SlaReportComponent } from './component/report/sla-report/sla-report.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoryCreateComponent,
    CategoryEditComponent,
    CategoryListComponent,
    CategoryViewComponent,
    ChangePasswordComponent,
    EditProfileComponent,
    HeaderComponent,
    LoginComponent,
    PriorityCreateComponent,
    PriorityEditComponent,
    PriorityListComponent,
    PriorityViewComponent,
    ResetPasswordComponent,
    TeamCreateComponent,
    TeamEditComponent,
    TeamListComponent,
    TeamViewComponent,
    TicketCreateComponent,
    TicketListComponent,
    UserCreateComponent,
    UserEditComponent,
    UserListComponent,
    UserViewComponent,
    TicketEditComponent,
    TicketViewComponent,
    CommentAddComponent,
    WorkloadReportComponent,
    SlaReportComponent,
  ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NotificationModule,
    ReactiveFormsModule,
    TooltipModule,
    EditorModule,
    FileUploadModule,
    CKEditorModule,
    QuillModule.forRoot(),
    NgxEditorModule
  ],
  providers: [NotificationService, AuthGuard, AuthService, UserService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
