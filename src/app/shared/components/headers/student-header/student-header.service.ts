import {inject, Injectable} from '@angular/core';
import {StudentHeaderComponent} from './student-header.component';
import {NotificationsApiService} from '../../../../core/services/notifications.api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentHeaderService {
  private service: NotificationsApiService = inject(NotificationsApiService);
  component: StudentHeaderComponent;

  constructor() { }


}
