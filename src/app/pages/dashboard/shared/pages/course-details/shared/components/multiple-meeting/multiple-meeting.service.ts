import { inject, Injectable } from '@angular/core';
import { MultipleMeetingComponent } from './multiple-meeting.component';
import { MeetingsApiService } from '../../../../../../../calendar/shared/services/meetings.api.service';
import { ApplicationMessageCenterService } from '../../../../../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class MultipleMeetingService {
  component: MultipleMeetingComponent;
  private meetingsService: MeetingsApiService = inject(MeetingsApiService);
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  constructor() {}

  create() {
    this.meetingsService
      .CreateMany(this.component.request)
      .subscribe((resp) => {
        if (resp.succeeded) {
          setTimeout(() => {
            this.message.showTranslatedSuccessMessage(
              'Created successfully.',
            );
            this.component.ref.close(true);
          }, 5000);
        }
      });
  }
}
