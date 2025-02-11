import { Component, inject, OnDestroy } from '@angular/core';
import { Location, NgForOf, NgIf, NgStyle } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CourseRequestModel } from '../../../../../models/course-request.model';
import { CourseGroupsService } from './course-groups.service';
import { GroupsResponseModel } from '../../../../../models/groups-response.model';
import { FormsModule } from '@angular/forms';
import { LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
import { UpgradePlanComponent } from '../../../../../../../../shared/components/upgrade-plan/upgrade-plan.component';

@Component({
  selector: 'app-course-groups',
  imports: [FormsModule, TranslatePipe, NgForOf, NgStyle, NgIf],
  templateUrl: './course-groups.component.html',
  styleUrl: './course-groups.component.scss',
})
export class CourseGroupsComponent implements OnDestroy {
  public location: Location = inject(Location);
  private service: CourseGroupsService = inject(CourseGroupsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);

  id = this.route.parent?.snapshot.paramMap.get('id') as string;
  request: CourseRequestModel = new CourseRequestModel();
  groups: GroupsResponseModel[] = [];
  searchText: string;
  langSubscribtion: any;
  allowedToAddGroup: boolean = true;
  constructor() {
    this.service.component = this;
    this.service.checkSlots();
    this.service.getCourse();
    this.service.getGroups();
    this.langSubscribtion = this.service.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.service.getCourse();
      },
    );
  }

  back() {
    this.router.navigate(['/main/educator/dashboard']);
  }

  filteredList: GroupsResponseModel[] = [];

  searchByName() {
    this.filteredList = this.groups.filter((obj) =>
      obj.name.toLowerCase().includes(this.searchText.toLowerCase()),
    );
    console.log(this.filteredList);
  }

  openDialog() {
    this.service.openDialog();
  }


  getGroupItem(item: GroupsResponseModel) {
    this.router.navigate([
      '/main/educator/dashboard/course/info',
      item.courseId,
      'groups',
      item.id,
    ]);
  }

  ngOnDestroy() {
    this.langSubscribtion.unsubscribe();
  }

  upgradePlan() {
    const ref = this.service.dialogService.open(UpgradePlanComponent, {
      width: '860px',
      style: {
        maxWidth: '95%',
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.service.checkSlots()
      }
    });
  }
}
