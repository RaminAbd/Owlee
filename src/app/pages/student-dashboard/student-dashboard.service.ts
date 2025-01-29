import {inject, Injectable} from '@angular/core';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {CoursesApiService} from '../admin-courses/shared/services/courses.api.service';
import {StorageService} from '../../core/services/storage.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ApplicationMessageCenterService} from '../../core/services/ApplicationMessageCenter.service';
import {StudentDashboardComponent} from './student-dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class StudentDashboardService {
  component: StudentDashboardComponent;
  private service: CoursesApiService = inject(CoursesApiService);
  private storage: StorageService = inject(StorageService);
  private translate: TranslateService = inject(TranslateService);
  private router: Router = inject(Router);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  constructor() {}

  getDashboard() {
    let authResp = this.storage.getObject('authResponse');
    const req = {
      StudentId: authResp.id,
      lang: this.translate.currentLang,
    };
    this.service.getDashboard(req).subscribe((resp) => {
      this.component.response = resp.data;
      this.component.filteredList = structuredClone(resp.data.courses);
    });
  }
}
