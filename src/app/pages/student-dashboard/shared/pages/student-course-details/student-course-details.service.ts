import { inject, Injectable } from '@angular/core';
import { CoursesApiService } from '../../../../admin-courses/shared/services/courses.api.service';
import { TranslateService } from '@ngx-translate/core';
import { StudentCourseDetailsComponent } from './student-course-details.component';
import { EducatorsApiService } from '../../../../educators/shared/services/educators.api.service';
import { KnownLanguagesApiService } from '../../../../known-languages/shared/services/known-languages.api.service';
import { TopicMaterialModel } from '../../../../dashboard/shared/models/topic-material.model';

@Injectable({
  providedIn: 'root',
})
export class StudentCourseDetailsService {
  component: StudentCourseDetailsComponent;
  private service: CoursesApiService = inject(CoursesApiService);
  public translate: TranslateService = inject(TranslateService);
  private educatorsService: EducatorsApiService = inject(EducatorsApiService);
  private langService: KnownLanguagesApiService = inject(
    KnownLanguagesApiService,
  );
  constructor() {}

  getKnownLangs() {
    this.langService
      .GetAllByLang(this.langService.serviceUrl, this.translate.currentLang)
      .subscribe((resp) => {
        this.component.languages = resp.data;
        this.getCourse();
      });
  }

  getCourse() {
    const req = {
      CourseId: this.component.id,
      lang: this.translate.currentLang,
    };
    this.service.GetDetailed(req).subscribe((resp) => {
      this.component.filteredFiles = [];
      this.component.allFiles = [];
      this.component.response = resp.data;
      this.component.response.topics.forEach((topic) => {
        topic.subtopics.forEach((subtopic) => {
          subtopic.files = subtopic.files.map((item) => ({
            ...item,
            icon: this.getLanguageIcon(item),
          }));
          this.component.allFiles.push(...subtopic.files);
        });
      });

      this.component.filteredTopics = structuredClone(
        this.component.response.topics,
      );
      this.component.filteredFiles = structuredClone(this.component.allFiles);

      console.log(this.component.response);
    });
  }

  private getLanguageIcon(item: TopicMaterialModel) {
    let finded = this.component.languages.find(
      (x) => x.id === item.systemLanguageId,
    );

    return finded ? finded.icon : '';
  }
}
