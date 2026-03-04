import { inject, Injectable } from '@angular/core';
import { MeetingUpsertComponent } from './meeting-upsert.component';
import { MeetingsApiService } from '../../../../../../../calendar/shared/services/meetings.api.service';
import { ApplicationMessageCenterService } from '../../../../../../../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class MeetingUpsertService {
  component: MeetingUpsertComponent;
  private meetingsService: MeetingsApiService = inject(MeetingsApiService);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  constructor() {}

  getMeeting() {
    this.component.request.subtopics = [];
    this.meetingsService
      .GetById(this.meetingsService.serviceUrl, this.component.request.id)
      .subscribe((resp) => {
        this.component.request = resp.data;

        this.component.date = new Date(
          new Date(resp.data.date).getTime() - 4 * 60 * 60 * 1000,
        );
        this.component.time = new Date(
          new Date(resp.data.date).getTime() - 4 * 60 * 60 * 1000,
        );
        this.component.request.subtopics = resp.data.subtopics.map(
          (x: any) => x.id,
        );
      });
  }

  save() {
    if (this.component.date && this.component.time) {
      const date = new Date(this.component.date);
      const time = new Date(this.component.time);
      date.setHours(time.getHours() + 4, time.getMinutes(), 0, 0);
      this.component.request.date = date.toISOString();
    }

    if (this.isValid())
      this.component.request.id === 'create' ? this.create() : this.update();
    else this.message.showTranslatedWarningMessage('Fields are not valid');
  }

  isValid() {
    let result = true;
    if (!this.component.request.date || !this.component.request.duration)
      result = false;
    return result;
  }

  create() {
    this.meetingsService
      .Create(this.meetingsService.serviceUrl, this.component.request)
      .subscribe(
        (resp) => {
          if (resp.succeeded) {
            setTimeout(() => {
              this.message.showTranslatedSuccessMessage(
                'Created successfully.',
              );
              this.component.ref.close(true);
            }, 5000);
          }
        },
        (error) => {
          this.component.isSubmitted = false;
        },
      );
  }

  update() {
    this.meetingsService
      .Update(this.meetingsService.serviceUrl, this.component.request)
      .subscribe(
        (resp) => {
          if (resp.succeeded) {
            setTimeout(() => {
              this.message.showTranslatedSuccessMessage(
                'Created successfully.',
              );
              this.component.ref.close(true);
            }, 5000);
          }
        },
        (error) => {
          this.component.isSubmitted = false;
        },
      );
  }
}
