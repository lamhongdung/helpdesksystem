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

  userId: number;
  loggedInEmail: string;
  loggedInRole: string;

  constructor(private router: Router, private authenticationService: AuthService,
              private shareService : ShareService,
              private notificationService: NotificationService) { 

    this.shareService.getClickEvent().subscribe(
      () => {
        this.loadHeader();
      }
    )
  }

  loadHeader() {
    this.userId = +this.authenticationService.getIdFromLocalStorage();
    this.loggedInEmail = this.authenticationService.getEmailFromLocalStorage();
    this.loggedInRole = this.authenticationService.getRoleFromLocalStorage();
    // console.log(this.loggedInEmail);
  }

  ngOnInit(): void {
    this.loadHeader();
  }

  logOut(){
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
  }

  // send notification to user
  sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }
}

