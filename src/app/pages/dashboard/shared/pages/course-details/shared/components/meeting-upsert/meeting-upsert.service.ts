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
        this.component.date = new Date(resp.data.date);
        this.component.request.subtopics = resp.data.subtopics.map(
          (x: any) => x.id,
        );
      });
  }

  save() {
    this.component.request.date = new Date(this.component.date).toISOString();
    this.component.request.id === 'create' ? this.create() : this.update();
  }

  create() {
    this.meetingsService
      .Create(this.meetingsService.serviceUrl, this.component.request)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.message.showTranslatedSuccessMessage('Successfully created!');
          this.component.ref.close(true);
        }
      });
  }

  update() {
    this.meetingsService
      .Update(this.meetingsService.serviceUrl, this.component.request)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.message.showTranslatedSuccessMessage('Successfully updated!');
          this.component.ref.close(true);
        }
      });
  }
}
