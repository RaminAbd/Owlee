import { Component, inject } from '@angular/core';
import { StudentSignupRequestModel } from '../../../../../auth/student-sign-up/shared/models/student-signup-request.model';
import { KnownLanguagesResponseModel } from '../../../../known-languages/shared/models/known-languages-response.model';
import { LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { StudentDetailsService } from './student-details.service';
import { MultiSelect } from 'primeng/multiselect';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentDashboardResponseModel } from '../../../../student-dashboard/shared/models/student-dashboard-response.model';
import { DashboardCourseModel } from '../../../../dashboard/shared/models/dashboard-course.model';

@Component({
  selector: 'app-student-details',
  imports: [
    LottieComponent,
    MultiSelect,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    NgClass,
    FormsModule,
    NgForOf,
  ],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.scss',
})
export class StudentDetailsComponent {
  private service: StudentDetailsService = inject(StudentDetailsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  request: StudentSignupRequestModel = new StudentSignupRequestModel();
  response: StudentDashboardResponseModel = new StudentDashboardResponseModel();
  selectedTab: number = 1;
  isSubmitted = false;
  knownLangs: KnownLanguagesResponseModel[] = [];
  passVisible: boolean = false;
  passSubmitted: boolean = false;
  langSubscribtion: any;
  id: string = this.route.snapshot.paramMap.get('id') as string;
  constructor() {
    this.service.component = this;
    this.service.getLanguages();
    this.service.getStudentInfo();
    this.service.getDashboard();

    this.langSubscribtion = this.service.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.service.getLanguages();
      },
    );
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }

  validateFirstStep() {
    this.isSubmitted = true;
    this.service.save();
    if (this.request.password) {
      this.service.savePassword();
    }
  }

  private animationItem: AnimationItem | undefined;
  mainLoading: boolean = false;
  options: AnimationOptions = {
    path: 'Animation.json',
    loop: true,
    autoplay: false,
  };

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    if (this.animationItem) {
      this.animationItem.play();
    }
  }

  ngOnDestroy() {
    this.langSubscribtion.unsubscribe();
  }

  getInfo(item: DashboardCourseModel) {
    this.router.navigate(['/main/admin/courses/', item.id]);
  }
}
