import { Component, inject, OnDestroy } from '@angular/core';
import {Location, NgForOf, NgStyle} from '@angular/common';
import { CourseInfoService } from '../course-info/course-info.service';
import { ActivatedRoute, Router } from '@angular/router';
import {LangChangeEvent, TranslatePipe, TranslateService} from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { CourseRequestModel } from '../../../../../models/course-request.model';
import { CourseRatingsService } from './course-ratings.service';
import {Rating} from 'primeng/rating';
import {FormsModule} from '@angular/forms';
import {RatingsOverviewModel} from '../../../../../models/ratings-overview.model';

@Component({
  selector: 'app-course-ratings',
  imports: [
    Rating,
    FormsModule,
    TranslatePipe,
    NgForOf,
    NgStyle
  ],
  templateUrl: './course-ratings.component.html',
  styleUrl: './course-ratings.component.scss',
})
export class CourseRatingsComponent implements OnDestroy {
  public location: Location = inject(Location);
  private service: CourseRatingsService = inject(CourseRatingsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private translate: TranslateService = inject(TranslateService);

  id = this.route.parent?.snapshot.paramMap.get('id') as string;
  request: CourseRequestModel = new CourseRequestModel();
  langSubscribtion: any;
  ratings:RatingsOverviewModel[]=[]
  total:number = 0
  back() {
    this.router.navigate(['/main/educator/dashboard']);
  }
  constructor() {
    this.service.component = this;
    this.service.getCourse();
    this.service.getOverview();
    this.langSubscribtion = this.service.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.service.getCourse();
      },
    );
  }

  ngOnDestroy() {
    this.langSubscribtion.unsubscribe();
  }
}
