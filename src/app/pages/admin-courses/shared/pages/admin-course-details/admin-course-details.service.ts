import { inject, Injectable } from '@angular/core';
import { CoursesApiService } from '../../services/courses.api.service';
import { TranslateService } from '@ngx-translate/core';
import { EducatorsApiService } from '../../../../educators/shared/services/educators.api.service';
import { KnownLanguagesApiService } from '../../../../known-languages/shared/services/known-languages.api.service';
import { TopicMaterialModel } from '../../../../dashboard/shared/models/topic-material.model';
import { AdminCourseDetailsComponent } from './admin-course-details.component';
import {RatingsApiService} from '../../../../student-dashboard/shared/services/ratings.api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminCourseDetailsService {
  component: AdminCourseDetailsComponent;
  private service: CoursesApiService = inject(CoursesApiService);
  public translate: TranslateService = inject(TranslateService);
  private educatorsService: EducatorsApiService = inject(EducatorsApiService);
  private langService: KnownLanguagesApiService = inject(
    KnownLanguagesApiService,
  );
  private ratingsService: RatingsApiService = inject(RatingsApiService);
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

      this.component.expanderStates = Array.from(
        { length: this.component.response.topics.length },
        () => 'collapsed',
      );
      console.log(this.component.response);
    });
  }

  private getLanguageIcon(item: TopicMaterialModel) {
    let finded = this.component.languages.find(
      (x) => x.id === item.systemLanguageId,
    );

    return finded ? finded.icon : '';
  }

  getAllMembers() {
    this.service.GetStudents(this.component.id).subscribe(resp=>{
      console.log(resp.data);
      this.component.members = resp.data.map((member:any) => ({
        ...member,
        fullName:member.firstName + ' ' + member.lastName,
      }))
    })
  }

  getRating(){
    const req = {
      courseId:this.component.id
    }
    this.ratingsService.GetOverview(req).subscribe((resp) => {
      const totalCount = resp.data.reduce((sum:any, item:any) => sum + item.count, 0);
      this.component.total = totalCount;
      this.component.ratings = resp.data.map((item:any)=>({
        ...item,
        percentage: totalCount > 0
          ? +(item.count / totalCount * 100).toFixed(2)
          : 0
      }))
      console.log(this.component.ratings);
    })
  }
}
