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
    if (this.isValid())
      this.component.request.id === 'create' ? this.create() : this.update();
    else this.message.showTranslatedWarningMessage('Fields are not valid');
  }

  isValid() {
    let result = true;
    if (
      !this.component.request.date ||
      this.component.request.subtopics.length == 0 ||
      !this.component.request.duration
    )
      result = false;
    return result;
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
