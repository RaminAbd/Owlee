import { inject, Injectable } from '@angular/core';
import { HomeComponent } from './home.component';
import { SubscriptionPackageApiService } from '../subscription-package/shared/services/subscription-package.api.service';
import { EmailsApiService } from './shared/services/emails.api.service';
import { ApplicationMessageCenterService } from '../../core/services/ApplicationMessageCenter.service';
import { FaqsApiService } from '../admin-faqs/shared/services/faqs.api.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CoursesApiService } from '../admin-courses/shared/services/courses.api.service';
import {CoursesResponseModel} from '../admin-courses/shared/models/courses-response.model';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  component: HomeComponent;
  private service: SubscriptionPackageApiService = inject(
    SubscriptionPackageApiService,
  );
  private emailsService: EmailsApiService = inject(EmailsApiService);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  protected _service: FaqsApiService = inject(FaqsApiService);
  protected translate: TranslateService = inject(TranslateService);
  protected coursesService: CoursesApiService = inject(CoursesApiService);
  subscribe: any;

  subscribeToLangEvent() {
    this.subscribe = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.getAllFAQs();
        this.getAllCourses();
      },
    );
  }

  getAllCourses() {
    this.coursesService
      .GetOpenCourses(this.translate.currentLang)
      .subscribe((resp) => {
        console.log(resp.data);
        this.component.courses = resp.data.splice(0, 4);
      });
  }

  getAllPackages() {
    this.service.GetAll(this.service.serviceUrl).subscribe((resp) => {
      this.component.subscriptionPackages = resp.data;
    });
  }

  send() {
    this.emailsService
      .SendEmail(this.component.form.value)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.message.showTranslatedSuccessMessage('Successfully created!');
          this.component.form.reset();
          this.component.isSubmitted = false;
        }
      });
  }

  getAllFAQs() {
    this._service
      .GetAllByLang(this._service.serviceUrl, this.translate.currentLang)
      .subscribe((resp) => {
        this.component.studentsFAQs = resp.data.filter(
          (x: any) => x.faqType === 2,
        );
        this.component.educatorsFAQs = resp.data.filter(
          (x: any) => x.faqType === 1,
        );
      });
  }

  addToFavorite(item: CoursesResponseModel) {
    const req = {
      courseId: item.id,
      studentId:localStorage.getItem('userId') as string
    }
    this.coursesService.AddToFavorite(req).subscribe((resp) => {
      this.getAllCourses()
    })
  }
}
