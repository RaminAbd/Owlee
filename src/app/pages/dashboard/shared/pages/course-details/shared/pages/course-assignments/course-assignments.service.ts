import { inject, Injectable } from '@angular/core';
import { HomeWorksApiService } from './shared/services/homeworks.api.service';
import { CoursesApiService } from '../../../../../../../admin-courses/shared/services/courses.api.service';
import { GroupsApiService } from '../../../../../services/groups.api.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ApplicationMessageCenterService } from '../../../../../../../../core/services/ApplicationMessageCenter.service';
import { DialogService } from 'primeng/dynamicdialog';
import { CourseGroupsComponent } from '../course-groups/course-groups.component';
import { GroupUpsertComponent } from '../../components/group-upsert/group-upsert.component';
import { CourseAssignmentsComponent } from './course-assignments.component';
import { AssignmentUpsertDialogComponent } from './shared/components/assignment-upsert-dialog/assignment-upsert-dialog.component';
import { FileModel } from '../../../../../../../../core/models/File.model';

@Injectable({
  providedIn: 'root',
})
export class CourseAssignmentsService {
  private service: HomeWorksApiService = inject(HomeWorksApiService);
  private coursesService: CoursesApiService = inject(CoursesApiService);
  private groupsService: GroupsApiService = inject(GroupsApiService);
  public translate: TranslateService = inject(TranslateService);
  private router: Router = inject(Router);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  public dialogService: DialogService = inject(DialogService);
  component: CourseAssignmentsComponent;

  getCourse() {
    const req = {
      id: this.component.id,
      lang: this.translate.currentLang,
    };
    this.coursesService
      .GetByIdByLang(this.coursesService.serviceUrl, req)
      .subscribe((resp) => {
        this.component.course = resp.data;
      });
  }

  getGroups() {
    this.groupsService.GetAllByCourse(this.component.id).subscribe((resp) => {
      this.component.groups = resp.data;
    });
  }

  getAssignments() {
    this.service.GetAllByCourse(this.component.id).subscribe((resp) => {
      this.component.list = resp.data;
      this.component.filteredList = structuredClone(resp.data);
    });
  }

  openDialog() {
    const ref = this.dialogService.open(AssignmentUpsertDialogComponent, {
      header: this.translate.instant('Assignment'),
      width: '460px',
      data: {
        groups: this.component.groups,
        request: this.component.request,
        courseId: this.component.id,
      },
      style: {
        maxWidth: '95%',
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.getAssignments();
      }
    });
  }

  getItem() {
    this.service
      .GetById(this.service.serviceUrl, this.component.assignment.id)
      .subscribe((resp) => {
        this.component.request = resp.data;
        this.component.request.file = new FileModel();
        this.openDialog();
      });
  }

  deleteItem() {
    this.service
      .Delete(this.service.serviceUrl, this.component.assignment.id)
      .subscribe((resp) => {
        this.getAssignments();
      });
  }
}
