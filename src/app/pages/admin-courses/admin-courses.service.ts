import { inject, Injectable } from '@angular/core';
import { FormatDate } from '../../core/extensions/format-date';
import { CoursesApiService } from './shared/services/courses.api.service';
import { AdminCoursesComponent } from './admin-courses.component';
import { KnownLanguagesApiService } from '../known-languages/shared/services/known-languages.api.service';
import { TranslateService } from '@ngx-translate/core';
import { KnownLanguagesResponseModel } from '../known-languages/shared/models/known-languages-response.model';

@Injectable({
  providedIn: 'root',
})
export class AdminCoursesService {
  private service: CoursesApiService = inject(CoursesApiService);
  private langService: KnownLanguagesApiService = inject(
    KnownLanguagesApiService,
  );
  private translate: TranslateService = inject(TranslateService);
  component: AdminCoursesComponent;
  languages: KnownLanguagesResponseModel[] = [];
  constructor() {}

  getAll() {
    this.service.GetAllDashboard(this.translate.currentLang).subscribe((resp) => {
      this.component.courses = resp.data.courses.map((course: any) => {
        return {
          ...course,
          language: this.getLanguageById(course.systemLanguageId),
        };
      });
    });
  }

  getAllLanguages() {
    this.langService
      .GetAllByLang(this.langService.serviceUrl, this.translate.currentLang)
      .subscribe((resp) => {
        this.languages = resp.data;
        console.log(this.languages);
        this.getAll();
      });
  }

  getLanguageById(id: string) {
    const lang = this.languages.find((x) => x.id === id);
    return lang ? lang.name : null;
  }

  setCols() {
    this.component.cols = [
      { field: 'name', header: 'Name' },
      { field: 'language', header: 'Language' },
      { field: 'groupCount', header: 'Groups' },
      { field: 'materialsCount', header: 'Materials' },
      { field: 'studentCount', header: 'Students' },
      { field: 'showActions', header: 'Actions' },
    ];
  }
}
