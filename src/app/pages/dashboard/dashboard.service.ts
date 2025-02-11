import { inject, Injectable } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CoursesApiService } from '../admin-courses/shared/services/courses.api.service';
import { StorageService } from '../../core/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ApplicationMessageCenterService } from '../../core/services/ApplicationMessageCenter.service';
import {UpgradePlanComponent} from '../../shared/components/upgrade-plan/upgrade-plan.component';
import {DialogService} from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  component: DashboardComponent;
  private service: CoursesApiService = inject(CoursesApiService);
  private storage: StorageService = inject(StorageService);
  private translate: TranslateService = inject(TranslateService);
  private router: Router = inject(Router);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  public dialogService: DialogService = inject(DialogService);
  constructor() {}

  getDashboard() {
    let authResp = this.storage.getObject('authResponse');
    const req = {
      educatorId: authResp.id,
      lang: this.translate.currentLang,
    };
    this.service.GetByEducator(req).subscribe((resp) => {
      this.component.response = resp.data;
      this.component.filteredList = structuredClone(resp.data.courses);
    });
  }

  checkSlots() {
    let educatorId = localStorage.getItem('userId') as string;
    this.service.GetAvailableCourseSlots(educatorId).subscribe((resp) => {
      if (resp.data !== 0) {
        this.router.navigate([
          '/main/educator/dashboard/course/upsert',
          'create',
        ]);
      } else {
        this.upgradePlan()
      }
    });
  }

  upgradePlan() {
    const ref = this.dialogService.open(UpgradePlanComponent, {
      width: '860px',
      style: {
        maxWidth: '95%',
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.checkSlots()
      }
    });
  }
}
/*
 * type 1 - group
 * type 2 - individual
 * implType 1 - Online
 * implType 2 - Offline
 * */
