import { inject, Injectable } from '@angular/core';
import { RangeMeetingComponent } from './range-meeting.component';
import { MeetingsApiService } from '../../../../../../../calendar/shared/services/meetings.api.service';

@Injectable({
  providedIn: 'root',
})
export class RangeMeetingService {
  private service: MeetingsApiService = inject(MeetingsApiService);
  component: RangeMeetingComponent;

  constructor() {}

  createSchedule() {
    this.service.CreateSchedule(this.component.request).subscribe((resp) => {
      if (resp.succeeded) {
        setTimeout(() => {
          this.component.message.showTranslatedSuccessMessage(
            'Created successfully.',
          );
          this.component.ref.close(true);
        }, 5000);
      }
    });
  }
}
