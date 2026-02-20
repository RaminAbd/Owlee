import {Component, inject} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {CoursesService} from '../courses/courses.service';
import {StorageService} from '../../core/services/storage.service';
import {CoursesResponseModel} from '../admin-courses/shared/models/courses-response.model';
import {FavoriteCoursesService} from './favorite-courses.service';

@Component({
  selector: 'app-favorite-courses',
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './favorite-courses.component.html',
  styleUrl: './favorite-courses.component.scss'
})
export class FavoriteCoursesComponent {
  private service: FavoriteCoursesService = inject(FavoriteCoursesService);
  private storage: StorageService = inject(StorageService);
  courses: CoursesResponseModel[] = [];
  userSignedIn:boolean = !!localStorage.getItem('userId');

  constructor() {
    this.service.component = this;
    let st = this.storage.getObject('authResponse');
    this.userSignedIn = !!(st && st.role === 'Student');
    this.service.subscribeToLangEvent();
    this.service.getAllCourses();
  }

  ngOnDestroy() {
    this.service.subscribe.unsubscribe();
  }

  makeFavorite(item: CoursesResponseModel) {
    this.service.addToFavorite(item);
  }
}
