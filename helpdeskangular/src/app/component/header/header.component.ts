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

  constructor(private router: Router, private authService: AuthService,
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
    // console.log(this.loggedInEmail);
  }

  ngOnInit(): void {
    this.loadHeader();
  }

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

  displayBriefProfile(userid: number, role: string, email: string): string {

    let briefProfile: string = "";
    let id: string;

    id = userid + "";

    if (['ROLE_CUSTOMER'].indexOf(role) !== -1) {
      briefProfile = `Customer: ${id} - ${email}`;
    }
    else if (['ROLE_SUPPORTER'].indexOf(role) !== -1) {
      briefProfile = `Supporter: ${id} - ${email}`;

    } else {
      briefProfile = `Admin: ${id} - ${email}`;

    }

    return briefProfile;
  }

}

