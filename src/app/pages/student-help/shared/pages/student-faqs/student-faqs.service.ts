import { Injectable } from '@angular/core';
import { LecturerFaqsComponent } from '../../../../lecturer-help/shared/pages/lecturer-faqs/lecturer-faqs.component';
import { FaqsApiService } from '../../../../admin-faqs/shared/services/faqs.api.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { StudentFaqsComponent } from './student-faqs.component';

@Injectable({
  providedIn: 'root',
})
export class StudentFaqsService {
  component: StudentFaqsComponent;
  subscribe: any;
  constructor(
    protected _service: FaqsApiService,
    protected translate: TranslateService,
  ) {}

  subscribeToLangEvent() {
    this.subscribe = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.getAllFAQs();
      },
    );
  }

  getAllFAQs() {
    this._service
      .GetAllByLang(this._service.serviceUrl, this.translate.currentLang)
      .subscribe((resp) => {
        this.component.FAQs = resp.data.filter((x: any) => x.faqType === 2);
      });
  }
}
