import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import { LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentCourseDetailsService } from '../../../../student-dashboard/shared/pages/student-course-details/student-course-details.service';
import { CourseDetailedResponseModel } from '../../../../student-dashboard/shared/models/course-detailed-response.model';
import { KnownLanguagesResponseModel } from '../../../../known-languages/shared/models/known-languages-response.model';
import { TopicMaterialModel } from '../../../../dashboard/shared/models/topic-material.model';
import { TopicRequestModel } from '../../../../dashboard/shared/models/topic-request.model';
import { AdminCourseDetailsService } from './admin-course-details.service';
import {GroupMembersResponseModel} from '../../../../dashboard/shared/models/group-members.response.model';

@Component({
  selector: 'app-admin-course-details',
  imports: [FormsModule, NgForOf, NgIf, TranslatePipe, NgClass, NgStyle],
  templateUrl: './admin-course-details.component.html',
  styleUrl: './admin-course-details.component.scss',
  animations: [
    trigger('expanderAnimation', [
      state(
        'collapsed',
        style({
          maxHeight: '0px',
          opacity: 0,
          zIndex: -1,
        }),
      ),
      state(
        'expanded',
        style({
          maxHeight: '200px',
          opacity: 1,
          zIndex: 1,
        }),
      ),
      transition('collapsed <=> expanded', [animate('0.3s ease-out')]),
    ]),
  ],
})
export class AdminCourseDetailsComponent implements OnDestroy {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private service: AdminCourseDetailsService = inject(
    AdminCourseDetailsService,
  );
  id = this.route.snapshot.paramMap.get('id') as string;
  response: CourseDetailedResponseModel = new CourseDetailedResponseModel();
  selectedTab: number = 1;
  selectedMatTab: number = 1;
  showEducator: boolean = false;
  languages: KnownLanguagesResponseModel[] = [];
  allFiles: TopicMaterialModel[] = [];
  filteredFiles: TopicMaterialModel[] = [];
  langSubscribtion: any;
  expanderStates: string[] = [];
  members: GroupMembersResponseModel[] = [];
  constructor() {
    this.service.component = this;
    this.service.getKnownLangs();
    this.service.getAllMembers()
    this.langSubscribtion = this.service.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.service.getKnownLangs();
      },
    );
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

  fileText: any;

  filterFiles() {
    this.filteredFiles = this.allFiles.filter((obj) =>
      obj.name.toLowerCase().includes(this.fileText.toLowerCase()),
    );
  }

  toggleExpander(index: number) {
    this.expanderStates[index] === 'expanded'
      ? (this.expanderStates[index] = 'collapsed')
      : (this.expanderStates[index] = 'expanded');
  }

  ngOnDestroy() {
    this.langSubscribtion.unsubscribe();
  }
}
