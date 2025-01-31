import {Component, inject, OnDestroy} from '@angular/core';
import {LangChangeEvent, TranslatePipe, TranslateService} from '@ngx-translate/core';
import { Location, NgClass, NgIf } from '@angular/common';
import { CourseRequestModel } from '../../../../../models/course-request.model';
import { CourseInfoService } from './course-info.service';
import { ActivatedRoute, Router } from '@angular/router';
import { KnownLanguagesResponseModel } from '../../../../../../../known-languages/shared/models/known-languages-response.model';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-course-info',
  imports: [TranslatePipe, NgClass, ConfirmDialog, NgIf],
  templateUrl: './course-info.component.html',
  styleUrl: './course-info.component.scss',
})
export class CourseInfoComponent  implements OnDestroy{
  public location: Location = inject(Location);
  private service: CourseInfoService = inject(CourseInfoService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private translate: TranslateService = inject(TranslateService);
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);

  id = this.route.parent?.snapshot.paramMap.get('id') as string;
  request: CourseRequestModel = new CourseRequestModel();
  languages: KnownLanguagesResponseModel[] = [];
  copyLoading: boolean = false;
  langSubscribtion: any;
  constructor() {
    this.service.component = this;
    this.service.getKnownLangs();
    this.langSubscribtion = this.service.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.service.getKnownLangs();
    });
  }

  back() {
    this.router.navigate(['/main/educator/dashboard']);
  }

  edit() {
    this.router.navigate([
      '/main/educator/dashboard/course/upsert',
      this.request.id,
    ]);
  }

  copy() {
    this.copyLoading = true;
    this.service.checkSlots();
  }

  delete() {
    this.confirm('Are you sure you want to delete this course?', () => {
      this.service.delete();
    });
  }

  confirm(message: string, success: any) {
    this.confirmationService.confirm({
      header: this.translate.instant('Confirmation'),
      message: this.translate.instant(message),
      icon: 'pi pi-exclamation-circle',
      rejectButtonProps: {
        label: this.translate.instant('Cancel'),
        icon: 'pi pi-times',
        outlined: true,
        size: 'small',
      },
      acceptButtonProps: {
        label: this.translate.instant('Confirm'),
        icon: 'pi pi-check',
        size: 'small',
      },
      accept: () => {
        success();
      },
      reject: () => {},
    });
  }
  ngOnDestroy() {
    this.langSubscribtion.unsubscribe()
  }
}
