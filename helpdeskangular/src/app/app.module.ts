import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TooltipModule } from 'ng2-tooltip-directive';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarCreateComponent } from './component/calendar/calendar-create/calendar-create.component';
import { CalendarListComponent } from './component/calendar/calendar-list/calendar-list.component';
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

@NgModule({
  declarations: [
    AppComponent,
    CalendarCreateComponent,
    CalendarListComponent,
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
    UserViewComponent
  ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NotificationModule,
    ReactiveFormsModule,
    TooltipModule
  ],
  providers: [NotificationService, AuthGuard, AuthService, UserService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
