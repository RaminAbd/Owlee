import { inject, Injectable } from '@angular/core';
import { HomeWorksApiService } from '../../services/homeworks.api.service';
import { FileModel } from '../../../../../../../../../../../core/models/File.model';
import { AssignmentDetailsComponent } from './assignment-details.component';
import { AssignmentUpsertDialogComponent } from '../../components/assignment-upsert-dialog/assignment-upsert-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { GroupsApiService } from '../../../../../../../../services/groups.api.service';

@Injectable({
  providedIn: 'root',
})
export class AssignmentDetailsService {
  private service: HomeWorksApiService = inject(HomeWorksApiService);
  public translate: TranslateService = inject(TranslateService);
  public dialogService: DialogService = inject(DialogService);
  component: AssignmentDetailsComponent;
  constructor() {}

  getItem() {
    this.service
      .GetById(this.service.serviceUrl, this.component.id)
      .subscribe((resp) => {
        this.component.request = resp.data;
        this.component.request.file = new FileModel();
        this.component.request.appliedStudents =
          this.component.request.students.filter((x) => x.submitted);
        console.log(this.component.request);
      });
  }

  openDialog() {
    const ref = this.dialogService.open(AssignmentUpsertDialogComponent, {
      header: this.translate.instant('Assignment'),
      width: '460px',
      data: {
        request: this.component.request,
      },
      style: {
        maxWidth: '95%',
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.getItem();
      }
    });
  }
}
