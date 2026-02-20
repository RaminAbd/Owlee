import { Component, inject } from '@angular/core';
import { CourseDetailedResponseModel } from '../../../../student-dashboard/shared/models/course-detailed-response.model';
import {
  LangChangeEvent,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { CourseDetailsService } from './course-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import {DatePipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import { StorageService } from '../../../../../core/services/storage.service';
import { DashboardCourseModel } from '../../../../dashboard/shared/models/dashboard-course.model';
import {ApplicationMessageCenterService} from '../../../../../core/services/ApplicationMessageCenter.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {RatingsOverviewModel} from '../../../../dashboard/shared/models/ratings-overview.model';
import {Rating} from 'primeng/rating';
import {FormsModule} from '@angular/forms';
import {CoursesResponseModel} from '../../../../admin-courses/shared/models/courses-response.model';

@Component({
  selector: 'app-course-details',
  imports: [TranslatePipe, DatePipe, NgStyle, NgIf, NgForOf, Rating, FormsModule],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss',
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
export class CourseDetailsComponent {
  private service: CourseDetailsService = inject(CourseDetailsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private message: ApplicationMessageCenterService = inject(ApplicationMessageCenterService);
  private translate: TranslateService = inject(TranslateService);
  private storage: StorageService = inject(StorageService);
  response: CourseDetailedResponseModel = new CourseDetailedResponseModel();
  id = this.route.snapshot.paramMap.get('id') as string;
  langSubscribtion: any;
  filteredList: DashboardCourseModel[] = [];
  loading:boolean = false;
  expanderStates: string[] = [];
  ratings:RatingsOverviewModel[]=[]
  userSignedIn:boolean = !!localStorage.getItem('userId');
  total:number = 0
  constructor() {
    let st = this.storage.getObject('authResponse');
    this.userSignedIn = !!(st && st.role === 'Student');
    this.service.component = this;
    this.service.getCourse();
    this.service.getRatings();
    this.langSubscribtion = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.service.getCourse();
      },
    );
    let id = localStorage.getItem('userId');
    if (id) {
      this.service.getDashboard();
    }
  }

  reserve() {
    let st = this.storage.getObject('authResponse');
    if (st) {
      if (st.role === 'Student') {
        this.goToPay();
      } else {
        this.router.navigate(['/auth/redirect/', this.response.id]);
      }
    } else {
      this.router.navigate(['/auth/redirect/', this.response.id]);
    }
  }

  private goToPay() {
    console.log('pay');
    let item = this.filteredList.find(item=>item.id === this.response.id);
    if(item) {
      this.message.showTranslatedWarningMessage('You are already subscribed to this course')
    }else{
      this.service.buy()
    }
  }

  toggleExpander(index: number) {
    this.expanderStates[index] === 'expanded'
      ? (this.expanderStates[index] = 'collapsed')
      : (this.expanderStates[index] = 'expanded');
  }
  makeFavorite() {
    this.service.addToFavorite();
  }
}
