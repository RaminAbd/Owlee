import { inject, Injectable } from '@angular/core';
import { CourseInfoComponent } from './course-info.component';
import { CoursesApiService } from '../../../../../../../admin-courses/shared/services/courses.api.service';
import { TranslateService } from '@ngx-translate/core';
import { KnownLanguagesApiService } from '../../../../../../../known-languages/shared/services/known-languages.api.service';
import { MessageService } from 'primeng/api';
import { ApplicationMessageCenterService } from '../../../../../../../../core/services/ApplicationMessageCenter.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CourseInfoService {
  component: CourseInfoComponent;
  private service: CoursesApiService = inject(CoursesApiService);
  public translate: TranslateService = inject(TranslateService);
  private router: Router = inject(Router);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  private langService: KnownLanguagesApiService = inject(
    KnownLanguagesApiService,
  );
  constructor() {}

  getCourse() {
    const req = {
      id: this.component.id,
      lang: this.translate.currentLang,
    };
    this.service
      .GetByIdByLang(this.service.serviceUrl, req)
      .subscribe((resp) => {
        this.component.request = resp.data;
        this.getLanguageName();
      });
  }

  getKnownLangs() {
    this.langService
      .GetAllByLang(this.langService.serviceUrl, this.translate.currentLang)
      .subscribe((resp) => {
        this.component.languages = resp.data;
        this.getCourse();
      });
  }

  private getLanguageName() {
    let finded = this.component.languages.find(
      (x) => x.id === this.component.request.systemLanguageId,
    );
    if (finded) {
      this.component.request.systemLanguageName = finded.name;
    }
  }

  copyCourse() {
    this.component.copyLoading = true;
    let educatorId = localStorage.getItem('userId') as string;
    const req = {
      courseId: this.component.request.id,
      educatorId: educatorId,
    };
    this.service.Copy(req).subscribe((resp) => {
      if (resp.succeeded) {
        this.message.showTranslatedSuccessMessage('Copied successfully');
        this.router.navigate([
          '/main/educator/dashboard/course/upsert',
          resp.data.id,
        ]);
        this.component.copyLoading = false;
      }
    });
  }

  checkSlots() {
    let educatorId = localStorage.getItem('userId') as string;
    this.service.GetAvailableCourseSlots(educatorId).subscribe((resp) => {
      this.component.copyLoading = false;
      if (resp.data !== 0) {
        this.component.confirm(
          'Are you sure you want to copy this course?',
          () => {
            this.copyCourse();
          },
        );
      } else {
        this.message.showTranslatedErrorMessage(
          'By your subscription, you cannot create more course',
        );
      }
    });
  }

  delete() {
    this.service
      .Delete(this.service.serviceUrl, this.component.request.id)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.message.showTranslatedSuccessMessage('Deleted successfully');
          this.component.location.back();
        }
      });
  }
}
