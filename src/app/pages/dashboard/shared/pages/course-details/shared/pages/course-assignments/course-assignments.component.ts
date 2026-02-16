import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, Location, NgForOf } from '@angular/common';
import {
  LangChangeEvent,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CourseRequestModel } from '../../../../../models/course-request.model';
import { GroupsResponseModel } from '../../../../../models/groups-response.model';
import { CourseAssignmentsService } from './course-assignments.service';
import { AssignmentsRequestModel } from './shared/models/assignments-request.model';
import { Popover } from 'primeng/popover';
import { AssignmentsResponseModel } from './shared/models/assignments-response.model';

@Component({
  selector: 'app-course-assignments',
  imports: [
    FormsModule,
    NgForOf,
    TranslatePipe,
    Popover,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './course-assignments.component.html',
  styleUrl: './course-assignments.component.scss',
})
export class CourseAssignmentsComponent implements OnDestroy {
  public location: Location = inject(Location);
  private service: CourseAssignmentsService = inject(CourseAssignmentsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);
  private translate: TranslateService = inject(TranslateService);

  id = this.route.parent?.snapshot.paramMap.get('id') as string;

  request: AssignmentsRequestModel = new AssignmentsRequestModel();
  groups: GroupsResponseModel[] = [];
  course: CourseRequestModel = new CourseRequestModel();

  searchText: string;
  langSubscribtion: any;

  constructor() {
    this.service.component = this;
    this.service.getCourse();
    this.service.getGroups();
    this.service.getAssignments();
    this.langSubscribtion = this.service.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.service.getCourse();
      },
    );
  }

  back() {
    this.router.navigate(['/main/educator/dashboard']);
  }

  list: AssignmentsResponseModel[] = [];
  filteredList: AssignmentsResponseModel[] = [];
  assignment: AssignmentsResponseModel = new AssignmentsResponseModel();
  searchByName() {
    this.filteredList = this.list.filter((obj) =>
      obj.title.toLowerCase().includes(this.searchText.toLowerCase()),
    );
    console.log(this.filteredList);
  }

  openDialog() {
    this.service.openDialog();
  }

  openToolbar(assignment: AssignmentsResponseModel) {
    this.assignment = structuredClone(assignment);
  }

  ngOnDestroy() {
    this.langSubscribtion.unsubscribe();
  }

  editItem() {
    this.service.getItem();
  }

  delete() {
    this.confirm('Are you sure you want to delete this assignment?', () => {
      this.service.deleteItem();
    });
  }

  confirm(message: string, success: any) {
    this.confirmationService.confirm({
      header: this.translate.instant('Confirmation'),
      message: message,
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
}
