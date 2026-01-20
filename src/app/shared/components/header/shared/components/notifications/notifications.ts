import { Component, inject } from '@angular/core';
import { Drawer } from 'primeng/drawer';
import { DatePipe, NgClass } from '@angular/common';
import { NotificationsResponseModel } from '../../../../../../core/models/notifications-response.model';
import { NotificationsService } from './notifications.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  imports: [Drawer, NgClass, DatePipe, TranslatePipe],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {
  private service: NotificationsService = inject(NotificationsService);
  private router: Router = inject(Router);
  showNotifications: boolean = false;
  selectedTab: number = 1;
  notificationsCopy: NotificationsResponseModel[] = [];
  notifications: NotificationsResponseModel[] = [];
  unreadCount: number = 0;
  constructor() {
    this.service.component = this;
    this.service.getAllNotifications();
  }

  selectTab(num: number) {
    this.selectedTab = num;
    if (this.selectedTab === 1) {
      this.notifications = structuredClone(this.notificationsCopy);
    } else {
      this.notifications = structuredClone(this.notificationsCopy).filter(
        (n) => !n.seen
      );
    }
  }

  readMessage(item: NotificationsResponseModel) {
    // switch (item.type) {
    //   case 1:
    //     this.router.navigate(['main/company/dashboard', item.id]);
    //     break;
    //   case 2:
    //     this.router.navigate(['main/company/campaign-plans/plan-review']);
    //     break;
    //   case 3:
    //     this.router.navigate(['main/company/dashboard']);
    //     break;
    //   case 4:
    //     this.router.navigate(['main/company/meetings']);
    //     break;
    // }
    this.service.getMessage(item);
    // this.showNotifications = false;
  }

  readAll() {
    if (this.notificationsCopy.length > 0) {
      this.service.readAll();
    }
  }
}
