import { inject, Injectable } from '@angular/core';
import { GroupUpsertComponent } from '../../../../../components/group-upsert/group-upsert.component';
import { GroupsApiService } from '../../../../../../../../services/groups.api.service';
import { ApplicationMessageCenterService } from '../../../../../../../../../../../core/services/ApplicationMessageCenter.service';
import { AssignmentUpsertDialogComponent } from './assignment-upsert-dialog.component';
import { HomeWorksApiService } from '../../services/homeworks.api.service';
import { BlobService } from '../../../../../../../../../../../core/services/blob.service';
import { FileModel } from '../../../../../../../../../../../core/models/File.model';

@Injectable({
  providedIn: 'root',
})
export class AssignmentUpsertDialogService {
  component: AssignmentUpsertDialogComponent;
  private service: HomeWorksApiService = inject(HomeWorksApiService);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  private blob: BlobService = inject(BlobService);

  constructor() {}

  save() {
    this.buildRequest();
    if (this.validate()) {
      console.log(this.component.request);
      this.component.loading = true;
      !this.component.request.id ? this.create() : this.update();
    } else {
      this.message.showTranslatedWarningMessage('Fill all fields');
    }
  }

  buildRequest() {
    this.component.request.educatorId = localStorage.getItem(
      'userId',
    ) as string;

    if (this.component.fromDate && this.component.fromTime) {
      const date = new Date(this.component.fromDate);
      const time = new Date(this.component.fromTime);

      // Set hours & minutes from time into date
      date.setHours(time.getHours()+4, time.getMinutes(), 0, 0);

      this.component.request.availableFrom = date.toISOString();
    }

    if (this.component.date && this.component.time) {
      const date = new Date(this.component.date);
      const time = new Date(this.component.time);

      // Set hours & minutes from time into date
      date.setHours(time.getHours()+4, time.getMinutes(), 0, 0);

      this.component.request.availableTo = date.toISOString();
    }
  }

  validate() {
    let result = true;

    if (
      !this.component.request.title ||
      !this.component.request.description ||
      !this.component.request.availableFrom ||
      !this.component.request.availableTo
    ) {
      result = false;
    }

    if (!this.component.request.id) {
      if (this.component.request.groupIds.length === 0) {
        result = false;
      }
    }

    return result;
  }

  uploadFile(file: any, callback: any) {
    const fd = new FormData();
    fd.append('file', file);
    this.blob.UploadFile(fd).subscribe((resp: any) => {
      callback(resp);
    });
  }

  private update() {
    this.service
      .Update(this.service.serviceUrl, this.component.request)
      .subscribe((resp) => {
        this.message.showTranslatedSuccessMessage('Updated successfully.');
        this.component.loading = false;
        this.component.ref.close(true);
      });
  }

  private create() {
    // delete this.component.request.id
    this.service
      .Create(this.service.serviceUrl, this.component.request)
      .subscribe((resp) => {
        this.message.showTranslatedSuccessMessage('Created successfully.');
        this.component.loading = false;
        this.component.ref.close(true);
      });
  }

  removeFile(file: FileModel, i: number) {
    this.blob.Delete(this.blob.ServiceUrl, file.id).subscribe((resp: any) => {
      file.fileLoading = false;
      this.component.request.files.splice(i, 1);
    });
  }
}
