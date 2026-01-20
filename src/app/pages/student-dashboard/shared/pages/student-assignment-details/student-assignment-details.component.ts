import { Component, inject } from '@angular/core';
import {DatePipe, Location, NgForOf, NgIf} from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AssignmentDetailsService } from '../../../../dashboard/shared/pages/course-details/shared/pages/course-assignments/shared/pages/assignment-details/assignment-details.service';
import { ActivatedRoute } from '@angular/router';
import { AssignmentsRequestModel } from '../../../../dashboard/shared/pages/course-details/shared/pages/course-assignments/shared/models/assignments-request.model';
import { StudentAssignmentDetailsService } from './student-assignment-details.service';
import {FileExporter} from '../../../../../core/extensions/download-zip';
import {FileModel} from '../../../../../core/models/File.model';
import {FormsModule} from '@angular/forms';
import {AssignmentSubmitRequestModel} from '../../models/assignment-submit-request.model';
import {ApplicationMessageCenterService} from '../../../../../core/services/ApplicationMessageCenter.service';

@Component({
  selector: 'app-student-assignment-details',
  imports: [DatePipe, NgForOf, TranslatePipe, NgIf, FormsModule],
  templateUrl: './student-assignment-details.component.html',
  styleUrl: './student-assignment-details.component.scss',
})
export class StudentAssignmentDetailsComponent {
  private service: StudentAssignmentDetailsService = inject(
    StudentAssignmentDetailsService,
  );
  private route: ActivatedRoute = inject(ActivatedRoute);
  location: Location = inject(Location);
  private message: ApplicationMessageCenterService = inject(ApplicationMessageCenterService);
  id = this.route.snapshot.paramMap.get('assignmentId') as string;
  response: AssignmentsRequestModel = new AssignmentsRequestModel();
  request:AssignmentSubmitRequestModel = new AssignmentSubmitRequestModel()
  constructor() {
    this.service.component = this;
    this.service.getItem();
  }

  download(item:FileModel) {
    item.fileLoading = true;
    FileExporter.downloadFilesIndividually(item.fileUrl).then(()=>{
      item.fileLoading = false;
    })
  }

  getImage(e: any) {
    const input = e.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }
    this.request.file.fileLoading = true;
    this.service.uploadFile(input.files[0], (resp: any) => {
      this.request.files.push(resp.data);
      this.request.file.fileLoading = false;
    });
  }

  getFileName(fileName: string): string {
    if (fileName) {
      if (fileName.length > 30) {
        return this.changeFileName(fileName);
      } else {
        return fileName;
      }
    } else {
      return '';
    }
  }

  changeFileName(name: string) {
    return (
      name.substring(0, 10) +
      '...' +
      name.substring(name.length - 5, name.length)
    );
  }

  removeFile(item: FileModel, i: number) {
    item.fileLoading = true;
    this.service.removeFile(item, i);
  }

  save() {
    if(this.request.files.length > 0 || this.request.answer ) {
      this.service.submit()
    }else{
      this.message.showTranslatedWarningMessage('Apply answer')
    }
  }
}
