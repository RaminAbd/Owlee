import {Component, inject} from '@angular/core';
import {AdminCoursesService} from '../admin-courses/admin-courses.service';
import {Router} from '@angular/router';
import {CoursesResponseModel} from '../admin-courses/shared/models/courses-response.model';
import {ConfirmationCoursesService} from './confirmation-courses.service';
import {TableComponent} from '../../shared/components/table/table.component';

@Component({
  selector: 'app-confirmation-courses',
  imports: [
    TableComponent
  ],
  templateUrl: './confirmation-courses.component.html',
  styleUrl: './confirmation-courses.component.scss'
})
export class ConfirmationCoursesComponent {
  private service: ConfirmationCoursesService = inject(ConfirmationCoursesService);
  private router: Router = inject(Router);
  courses: CoursesResponseModel[] = [];
  cols: any[] = [];
  constructor() {
    this.service.component = this;
    this.service.getAll();
    this.service.setCols();
  }

  getInfo(e: any) {
    this.router.navigate(['/main/admin/courses/', e.data.id]);
  }
}
