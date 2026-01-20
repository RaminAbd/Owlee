import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AssignmentsRequestModel } from '../../models/assignments-request.model';
import { AssignmentDetailsService } from './assignment-details.service';
import { DatePipe, Location, NgForOf, NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SubmittedStudentModel } from '../../models/submitted-student.model';
import { FileExporter } from '../../../../../../../../../../../core/extensions/download-zip';

@Component({
  selector: 'app-assignment-details',
  imports: [TranslatePipe, DatePipe, NgForOf, NgIf, RouterLink],
  templateUrl: './assignment-details.component.html',
  styleUrl: './assignment-details.component.scss',
})
export class AssignmentDetailsComponent {
  private service: AssignmentDetailsService = inject(AssignmentDetailsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  location: Location = inject(Location);
  id = this.route.snapshot.paramMap.get('id') as string;
  request: AssignmentsRequestModel = new AssignmentsRequestModel();
  constructor() {
    this.service.component = this;
    this.service.getItem();
  }

  openDialog() {
    this.service.openDialog();
  }

  downloadFiles(item: SubmittedStudentModel) {
    item.loadingFiles = true;
    let fileUrls = item.files.map((item) => item.fileUrl);
    FileExporter.downloadFilesAsZip(fileUrls).then(() => {
      item.loadingFiles = false;
    });
  }
}
