import { inject, Injectable } from '@angular/core';
import { CoursesApiService } from '../../../../admin-courses/shared/services/courses.api.service';
import { TranslateService } from '@ngx-translate/core';
import { StudentCourseDetailsComponent } from './student-course-details.component';
import { EducatorsApiService } from '../../../../educators/shared/services/educators.api.service';
import { KnownLanguagesApiService } from '../../../../known-languages/shared/services/known-languages.api.service';
import { TopicMaterialModel } from '../../../../dashboard/shared/models/topic-material.model';
import {
  HomeWorksApiService
} from '../../../../dashboard/shared/pages/course-details/shared/pages/course-assignments/shared/services/homeworks.api.service';
import {
  AssignmentsResponseModel
} from '../../../../dashboard/shared/pages/course-details/shared/pages/course-assignments/shared/models/assignments-response.model';
import {FileExporter} from '../../../../../core/extensions/download-zip';

@Injectable({
  providedIn: 'root',
})
export class StudentCourseDetailsService {
  component: StudentCourseDetailsComponent;
  private service: CoursesApiService = inject(CoursesApiService);
  public translate: TranslateService = inject(TranslateService);
  private assignmentsService: HomeWorksApiService = inject(HomeWorksApiService);
  private langService: KnownLanguagesApiService = inject(
    KnownLanguagesApiService,
  );
  constructor() {}

  getKnownLangs() {
    this.langService
      .GetAllByLang(this.langService.serviceUrl, this.translate.currentLang)
      .subscribe((resp) => {
        this.component.languages = resp.data;
        console.log(this.component.languages, "languges");
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
        topic.files = topic.files.map((item) => ({
          ...item,
          icon: this.getLanguageIcon(item),
        }));
        this.component.allFiles.push(...topic.files);
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


  getAllAssignments(){
    const req = {
      CourseId: this.component.id,
      studentId:localStorage.getItem('userId') as string,
    }
    this.assignmentsService.GetAllForStudent(req).subscribe((resp) => {
      console.log(resp.data)
      this.component.assignments = resp.data.map((item:AssignmentsResponseModel)=>({
        ...item,
        isPast: new Date(item.availableTo).getTime() < Date.now(),
      }));
    })
  }

  downloadFile(mat: any) {
    FileExporter.downloadFilesIndividually(mat.file.fileUrl).then(()=>{
      mat.fileLoading = false;
    })
  }
}
