import { inject, Injectable } from '@angular/core';
import { HomeWorksApiService } from '../../../../dashboard/shared/pages/course-details/shared/pages/course-assignments/shared/services/homeworks.api.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AssignmentDetailsComponent } from '../../../../dashboard/shared/pages/course-details/shared/pages/course-assignments/shared/pages/assignment-details/assignment-details.component';
import { FileModel } from '../../../../../core/models/File.model';
import { StudentAssignmentDetailsComponent } from './student-assignment-details.component';
import { BlobService } from '../../../../../core/services/blob.service';

@Injectable({
  providedIn: 'root',
})
export class StudentAssignmentDetailsService {
  private service: HomeWorksApiService = inject(HomeWorksApiService);
  public translate: TranslateService = inject(TranslateService);
  public dialogService: DialogService = inject(DialogService);
  private blob: BlobService = inject(BlobService);
  component: StudentAssignmentDetailsComponent;
  constructor() {}

  getItem() {
    this.service.GetForSubmission(this.component.id).subscribe((resp) => {
      this.component.response = resp.data;
      console.log(this.component.request);
      if (this.component.response.submitted) {
        this.component.request.file = new FileModel();
        this.component.request.files = this.component.response.studentFiles;
        this.component.request.answer = this.component.response.answer;
      }
    });
  }

  uploadFile(file: any, callback: any) {
    const fd = new FormData();
    fd.append('file', file);
    this.blob.UploadFile(fd).subscribe((resp: any) => {
      callback(resp);
    });
  }

  removeFile(file: FileModel, i: number) {
    this.blob.Delete(this.blob.ServiceUrl, file.id).subscribe((resp: any) => {
      file.fileLoading = false;
      this.component.request.files.splice(i, 1);
    });
  }

  submit() {
    this.component.request.id = this.component.id;
    console.log(this.component.request);
    this.service.Submit(this.component.request).subscribe((resp) => {
      this.component.location.back();
    });
  }
}
