import { Component, inject, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CourseRequestModel } from '../../../../../models/course-request.model';
import { GroupDetailsService } from './group-details.service';
import {LangChangeEvent, TranslatePipe, TranslateService} from '@ngx-translate/core';
import { GroupRequestModel } from '../../../../../models/group-request.model';
import { TopicRequestModel } from '../../../../../models/topic-request.model';
import { Popover } from 'primeng/popover';
import { GroupUpsertComponent } from '../../components/group-upsert/group-upsert.component';
import { DialogService } from 'primeng/dynamicdialog';
import {Confirmation} from '../../../../../../../../core/extensions/confirmation';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-group-details',
  imports: [TranslatePipe, RouterOutlet, RouterLink, RouterLinkActive, Popover],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.scss',
})
export class GroupDetailsComponent implements OnDestroy {
  public service: GroupDetailsService = inject(GroupDetailsService);
  public location: Location = inject(Location);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  public dialogService: DialogService = inject(DialogService);
  public confirmationService: ConfirmationService = inject(ConfirmationService);
  public translate: TranslateService = inject(TranslateService);
  courseId = this.route.parent?.snapshot.paramMap.get('id') as string;
  groupId = this.route.snapshot.paramMap.get('groupId') as string;
  course: CourseRequestModel = new CourseRequestModel();
  group: GroupRequestModel = new GroupRequestModel();
  langSubscribtion: any;
  constructor() {
    this.service.component = this;
    this.service.getCourse();
    this.service.getGroup();
    this.langSubscribtion = this.service.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.service.getCourse();
      },
    );
  }
  back() {
    this.router.navigate([
      '/main/educator/dashboard/course/info',
      this.courseId,
      'groups',
    ]);
  }

  ngOnDestroy() {
    this.langSubscribtion.unsubscribe();
  }

  editGroup() {
    this.openDialog();
  }

  openDialog() {
    const ref = this.dialogService.open(GroupUpsertComponent, {
      header: 'Group',
      width: '460px',
      data: {
        courseId: this.course.id,
        groupId: this.group.id,
        group: structuredClone(this.group),
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.service.getGroup();
      }
    });
  }
  deleteGroup() {
    Confirmation.confirm(
      this.confirmationService,
      this.translate,
      'Are you sure you want to delete this group?',
      () => {
        this.service.delete();
      },
    );
  }
}
