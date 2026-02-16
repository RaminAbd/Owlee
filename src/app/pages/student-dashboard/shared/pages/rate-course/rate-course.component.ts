import {Component, inject} from '@angular/core';
import {Location, NgIf} from '@angular/common';
import {
  CourseInfoService
} from '../../../../dashboard/shared/pages/course-details/shared/pages/course-info/course-info.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RateCourseService} from './rate-course.service';
import {CourseDetailedResponseModel} from '../../models/course-detailed-response.model';
import {TranslatePipe} from '@ngx-translate/core';
import {Rating} from 'primeng/rating';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-rate-course',
  imports: [
    TranslatePipe,
    Rating,
    FormsModule,
    NgIf
  ],
  templateUrl: './rate-course.component.html',
  styleUrl: './rate-course.component.scss'
})
export class RateCourseComponent {
  public location: Location = inject(Location);
  private service: RateCourseService = inject(RateCourseService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  courseId = this.route.snapshot.paramMap.get('id') as string;
  response: CourseDetailedResponseModel = new CourseDetailedResponseModel();
  value:any = 0
  comment:string=''
  constructor() {
    this.service.component = this;
    console.log(this.courseId)
    this.service.getRating()
    this.service.getCourse()
  }

  skip(){
    this.router.navigate([
      'main/student/dashboard/course/info/',
      this.courseId,
    ]);
  }

  submit(){
    console.log(this.value)
    if(this.value){
      this.service.rate()
    }
  }

}
