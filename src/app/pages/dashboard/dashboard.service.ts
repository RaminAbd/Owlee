import { inject, Injectable } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CoursesApiService } from '../admin-courses/shared/services/courses.api.service';
import { StorageService } from '../../core/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  component: DashboardComponent;
  private service: CoursesApiService = inject(CoursesApiService);
  private storage: StorageService = inject(StorageService);
  constructor() {}

  getDashboard() {
    let authResp = this.storage.getObject('authResponse');
    this.service.GetByEducator(authResp.id).subscribe((resp) => {
      this.component.response = resp.data;
    });
  }
}
