import { inject, Injectable } from '@angular/core';
import { Notifications } from './notifications';
import { NotificationsApiService } from '../../../../../../core/services/notifications.api.service';
import { NotificationsResponseModel } from '../../../../../../core/models/notifications-response.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private service: NotificationsApiService = inject(NotificationsApiService);
  private translate: TranslateService = inject(TranslateService);
  component: Notifications;
  constructor() {}

  getAllNotifications() {
    let userId = localStorage.getItem('userId') as string;
    const req = {
      UserId: userId,
      lang: this.translate.currentLang,
    };
    this.service.getAllByReceiver(req).subscribe((resp) => {
      console.log(resp.data);
      this.component.notifications = structuredClone(resp.data);
      this.component.notificationsCopy = structuredClone(resp.data);
      this.component.unreadCount = this.component.notifications.filter(
        (x) => !x.seen,
      ).length;
    });
  }

  getMessage(item: NotificationsResponseModel) {
    const req = {
      id: item.id,
    };
    this.service.MarkAsSeen(req).subscribe((resp) => {
      this.getAllNotifications();
    });
  }

  readAll() {
    const req = {
      receiverId: localStorage.getItem('userId') as string,
    };
    this.service.MarkAsSeenAll(req).subscribe((resp) => {
      this.getAllNotifications();
    });
  }
}
