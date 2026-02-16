import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoursesService } from './courses.service';
import { CoursesResponseModel } from '../admin-courses/shared/models/courses-response.model';
import {DatePipe, NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-courses',
  imports: [
    DatePipe,
    NgForOf,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent implements OnDestroy {
  private service: CoursesService = inject(CoursesService);
  courses: CoursesResponseModel[] = [];
  constructor() {
    this.service.component = this;
    this.service.subscribeToLangEvent();
    this.service.getAllCourses();
  }

  ngOnDestroy() {
    this.service.subscribe.unsubscribe();
  }
}
