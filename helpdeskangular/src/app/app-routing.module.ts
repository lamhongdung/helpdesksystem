import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { CalendarCreateComponent } from './component/calendar/calendar-create/calendar-create.component';
// import { CalendarListComponent } from './component/calendar/calendar-list/calendar-list.component';
import { CategoryCreateComponent } from './component/category/category-create/category-create.component';
import { CategoryEditComponent } from './component/category/category-edit/category-edit.component';
import { CategoryListComponent } from './component/category/category-list/category-list.component';
import { CategoryViewComponent } from './component/category/category-view/category-view.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { EditProfileComponent } from './component/edit-profile/edit-profile.component';
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
import { TicketEditComponent } from './component/ticket/ticket-edit/ticket-edit.component';
import { TicketListComponent } from './component/ticket/ticket-list/ticket-list.component';
import { TicketViewComponent } from './component/ticket/ticket-view/ticket-view.component';
import { UserCreateComponent } from './component/user/user-create/user-create.component';
import { UserEditComponent } from './component/user/user-edit/user-edit.component';
import { UserListComponent } from './component/user/user-list/user-list.component';
import { UserViewComponent } from './component/user/user-view/user-view.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // login
  { path: 'login', component: LoginComponent },
  // reset password
  { path: 'reset-password', component: ResetPasswordComponent },
  // edit profile
  {
    path: 'edit-profile/:id', component: EditProfileComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_CUSTOMER', 'ROLE_SUPPORTER', 'ROLE_ADMIN']
    }
  },
  // change password
  {
    path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_CUSTOMER', 'ROLE_SUPPORTER', 'ROLE_ADMIN']
    }
  },
  // User menu 
  {
    path: 'user-list', component: UserListComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'user-create', component: UserCreateComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'user-edit/:id', component: UserEditComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'user-view/:id', component: UserViewComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  // Category menu
  {
    path: 'category-list', component: CategoryListComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'category-create', component: CategoryCreateComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'category-edit/:id', component: CategoryEditComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'category-view/:id', component: CategoryViewComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  // priority menu
  {
    path: 'priority-list', component: PriorityListComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'priority-create', component: PriorityCreateComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'priority-edit/:id', component: PriorityEditComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'priority-view/:id', component: PriorityViewComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  // Team menu
  {
    path: 'team-list', component: TeamListComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'team-create', component: TeamCreateComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'team-edit/:id', component: TeamEditComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'team-view/:id', component: TeamViewComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'ticket-list', component: TicketListComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_CUSTOMER', 'ROLE_SUPPORTER', 'ROLE_ADMIN']
    }
  },
  {
    path: 'ticket-create', component: TicketCreateComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_CUSTOMER', 'ROLE_SUPPORTER', 'ROLE_ADMIN']
    }
  },
  {
    path: 'ticket-edit/:id', component: TicketEditComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_SUPPORTER', 'ROLE_ADMIN']
    }
  },
  {
    path: 'ticket-view/:id', component: TicketViewComponent, canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_CUSTOMER', 'ROLE_SUPPORTER', 'ROLE_ADMIN']
    }
  },
  // // Calendar menu
  // {
  //   path: 'calendar-list', component: CalendarListComponent, canActivate: [AuthGuard],
  //   data: {
  //     roles: ['ROLE_ADMIN']
  //   }
  // },
  // {
  //   path: 'calendar-create', component: CalendarCreateComponent, canActivate: [AuthGuard],
  //   data: {
  //     roles: ['ROLE_ADMIN']
  //   }
  // },

  // if paths are not in the above list then redirects to path '/users-list'
  { path: '**', redirectTo: '/ticket-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
