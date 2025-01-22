import { inject, Injectable } from '@angular/core';
import { CoursesApiService } from '../../../../../../../admin-courses/shared/services/courses.api.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ApplicationMessageCenterService } from '../../../../../../../../core/services/ApplicationMessageCenter.service';
import { CourseGroupsComponent } from './course-groups.component';
import { GroupsApiService } from '../../../../../services/groups.api.service';
import { GroupUpsertComponent } from '../../components/group-upsert/group-upsert.component';
import { DialogService } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class CourseGroupsService {
  private coursesService: CoursesApiService = inject(CoursesApiService);
  private service: GroupsApiService = inject(GroupsApiService);
  private translate: TranslateService = inject(TranslateService);
  private router: Router = inject(Router);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  public dialogService: DialogService = inject(DialogService);
  component: CourseGroupsComponent;

  getCourse() {
    const req = {
      id: this.component.id,
      lang: this.translate.currentLang,
    };
    this.coursesService
      .GetByIdByLang(this.coursesService.serviceUrl, req)
      .subscribe((resp) => {
        this.component.request = resp.data;
      });
  }

  getGroups() {
    this.service.GetAllByCourse(this.component.id).subscribe((resp) => {
      this.component.groups = resp.data;
      this.component.filteredList = structuredClone(resp.data);
    });
  }

  checkSlots() {
    this.service.GetAvailableGroupSlots(this.component.id).subscribe((resp) => {
      if (resp.data !== 0) {
        this.openDialog();
      } else {
        this.message.showTranslatedErrorMessage(
          'By your subscription, you cannot create more group',
        );
      }
    });
  }

  openDialog() {
    const ref = this.dialogService.open(GroupUpsertComponent, {
      header: 'Group',
      width: '460px',
      data: {
        courseId:this.component.id,
        groupId: 'create',
      }

    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.getGroups();
      }
    });
  }
}
