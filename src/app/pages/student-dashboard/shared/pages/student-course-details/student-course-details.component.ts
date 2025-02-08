import {
  Component,
  ElementRef,
  inject, OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentCourseDetailsService } from './student-course-details.service';
import { CourseRequestModel } from '../../../../dashboard/shared/models/course-request.model';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {LangChangeEvent, TranslatePipe} from '@ngx-translate/core';
import { CourseDetailedResponseModel } from '../../models/course-detailed-response.model';
import { KnownLanguagesResponseModel } from '../../../../known-languages/shared/models/known-languages-response.model';
import { SubtopicModel } from '../../../../dashboard/shared/models/subtopic.model';
import { TopicRequestModel } from '../../../../dashboard/shared/models/topic-request.model';
import {FormsModule} from '@angular/forms';
import {TopicMaterialModel} from '../../../../dashboard/shared/models/topic-material.model';

@Component({
  selector: 'app-student-course-details',
  imports: [NgIf, TranslatePipe, NgClass, NgForOf, FormsModule],
  templateUrl: './student-course-details.component.html',
  styleUrl: './student-course-details.component.scss',
})
export class StudentCourseDetailsComponent implements OnDestroy {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private service: StudentCourseDetailsService = inject(
    StudentCourseDetailsService,
  );
  id = this.route.snapshot.paramMap.get('id') as string;
  response: CourseDetailedResponseModel = new CourseDetailedResponseModel();
  selectedTab: number = 1;
  selectedMatTab: number = 1;
  showEducator: boolean = false;
  languages: KnownLanguagesResponseModel[] = [];
  allFiles:TopicMaterialModel[] = [];
  filteredFiles:TopicMaterialModel[] = [];
  langSubscribtion:any
  constructor() {
    this.service.component = this;
    this.service.getKnownLangs();
    this.langSubscribtion = this.service.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.service.getKnownLangs();
    });
  }

  back() {
    this.router.navigate(['/main/student/dashboard']);
  }

  @ViewChildren('subTopic') subTopics!: QueryList<ElementRef>;

  goToSubTopic(sub: any) {
    const subTopicElement = this.subTopics.find(
      (item: ElementRef) =>
        item.nativeElement.querySelector('.sub-name').textContent === sub.name,
    );
    if (subTopicElement) {
      subTopicElement.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  searchTerm: string;
  filteredTopics: TopicRequestModel[] = [];
  filterTopics() {
    if (!this.searchTerm) {
      this.filteredTopics = [...this.response.topics];
      return;
    }

    this.filteredTopics = this.response.topics
      .map((topic) => ({
        ...topic,
        subtopics: topic.subtopics.filter(
          (sub) =>
            sub.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            topic.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
        ),
      }))
      .filter((topic) => topic.subtopics.length > 0);
  }

  fileText:any

  filterFiles() {
    this.filteredFiles = this.allFiles.filter((obj) =>
      obj.name.toLowerCase().includes(this.fileText.toLowerCase()),
    );
  }

  ngOnDestroy() {
    this.langSubscribtion.unsubscribe()
  }
}
