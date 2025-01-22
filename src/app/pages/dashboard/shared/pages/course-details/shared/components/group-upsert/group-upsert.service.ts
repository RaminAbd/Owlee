import { inject, Injectable } from '@angular/core';
import { GroupUpsertComponent } from './group-upsert.component';
import { ApplicationMessageCenterService } from '../../../../../../../../core/services/ApplicationMessageCenter.service';
import { GroupsApiService } from '../../../../../services/groups.api.service';

@Injectable({
  providedIn: 'root',
})
export class GroupUpsertService {
  component: GroupUpsertComponent;
  private service: GroupsApiService = inject(GroupsApiService);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  constructor() {}

  save() {
    if (this.validate()) {
      this.component.request.id === 'create' ? this.create() : this.update();
    } else {
      this.message.showTranslatedWarningMessage('Fill all fields');
    }
  }

  validate() {
    let result = true;
    if (
      !this.component.request.name ||
      !this.component.request.type ||
      !this.component.request.implementationType
    ) {
      return false;
    }
    return result;
  }

  private update() {
    this.service
      .Update(this.service.serviceUrl, this.component.request)
      .subscribe((resp) => {
        this.message.showTranslatedSuccessMessage('Updated successfully.');
        this.component.ref.close(true);
      });
  }

  private create() {
    delete this.component.request.id
    this.service
      .Create(this.service.serviceUrl, this.component.request)
      .subscribe((resp) => {
        this.message.showTranslatedSuccessMessage('Created successfully.');
        this.component.ref.close(true);
      });
  }
}
