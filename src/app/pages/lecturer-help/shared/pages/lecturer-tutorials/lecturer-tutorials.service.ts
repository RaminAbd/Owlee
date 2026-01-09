import { inject, Injectable } from '@angular/core';
import { LecturerFaqsComponent } from '../lecturer-faqs/lecturer-faqs.component';
import { FaqsApiService } from '../../../../admin-faqs/shared/services/faqs.api.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LecturerTutorialsComponent } from './lecturer-tutorials.component';
import { TutorialsApiService } from '../../../../admin-tutorials/shared/services/tutorials.api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class LecturerTutorialsService {
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  component: LecturerTutorialsComponent;
  subscribe: any;
  constructor(
    protected _service: TutorialsApiService,
    protected translate: TranslateService,
  ) {}

  subscribeToLangEvent() {
    this.subscribe = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.getAllTutorials();
      },
    );
  }

  getAllTutorials() {
    this._service
      .GetAllByLang(this._service.serviceUrl, this.translate.currentLang)
      .subscribe((resp) => {
        this.component.tutorials = resp.data.map((item: any) => ({
          ...item,
          videoUrl: this.getSafeVideoUrl(item.url),
        }));
      });
  }
  getSafeVideoUrl(url: string): SafeResourceUrl {
    const videoId = this.extractVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractVideoId(url: string): string {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|live\/|&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  }
}
