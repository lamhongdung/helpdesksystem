import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ShareService } from 'src/app/service/share.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userid: number;
  loggedInEmail: string;
  loggedInRole: string;
  loggedInFullname: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private shareService: ShareService,
    private notificationService: NotificationService) {

    this.shareService.getClickEvent().subscribe({
      next: () => {
        this.loadHeader();
      }
    })
  }

  loadHeader() {

    this.userid = +this.authService.getIdFromLocalStorage();
    this.loggedInEmail = this.authService.getEmailFromLocalStorage();
    this.loggedInRole = this.authService.getRoleFromLocalStorage();
    this.loggedInFullname = this.authService.getFullnameFromLocalStorage();
  }

  ngOnInit(): void {
    this.loadHeader();
  }

  // user clicks on the "logout" menu
  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  // send notification to user
  sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  } // end of sendNotification()

  // display brief profile at the top-right corner of the screen.
  // ex: Admin: 20 - fullname
  displayBriefProfile(userid: number, role: string, fullname: string): string {

    let briefProfile: string = "";
    let id: string;

    id = userid + "";

    if (['ROLE_CUSTOMER'].indexOf(role) !== -1) {
      briefProfile = `Customer: ${id} - ${fullname}`;
    }
    else if (['ROLE_SUPPORTER'].indexOf(role) !== -1) {
      briefProfile = `Supporter: ${id} - ${fullname}`;

    } else {
      briefProfile = `Admin: ${id} - ${fullname}`;

    }

    return briefProfile;

  } // end of displayBriefProfile()

}

