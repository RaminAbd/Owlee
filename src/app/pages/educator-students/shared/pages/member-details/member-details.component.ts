import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MemberDetailsService } from './member-details.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import {GroupMembersResponseModel} from '../../../../dashboard/shared/models/group-members.response.model';
import {
  StudentSignupRequestModel
} from '../../../../../auth/student-sign-up/shared/models/student-signup-request.model';
import {PaymentsResponseModel} from '../../../../educator-plans/shared/models/payments-response.model';
import {AttendancesResponseModel} from '../../../../calendar/shared/models/attendances-response.model';
import {Confirmation} from '../../../../../core/extensions/confirmation';

@Component({
  selector: 'app-member-details',
  imports: [
    TranslatePipe,
    NgClass,
    DatePipe,
    FormsModule,
    NgForOf,
    NgIf,
    DatePicker,
  ],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.scss',
})
export class MemberDetailsComponent {
  private service: MemberDetailsService = inject(MemberDetailsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private translate: TranslateService = inject(TranslateService);
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);
  member: GroupMembersResponseModel = new GroupMembersResponseModel();
  student: StudentSignupRequestModel = new StudentSignupRequestModel();
  id = this.route.snapshot.paramMap.get('id') as string;
  selectedTab: number = 1;
  payments: PaymentsResponseModel[] = [];
  filteredList: PaymentsResponseModel[] = [];
  searchText: string;

  attendances: AttendancesResponseModel[] = [];
  date: any;

  constructor() {
    this.service.component = this;
    this.service.getMember();
  }

  searchByName() {
    const text = this.searchText.trim().toLowerCase();

    if (!text) {
      this.filteredList = [...this.payments];
      return;
    }

    this.filteredList = this.payments.filter((user) =>
      [user.course, user.student].some((field) =>
        field.toLowerCase().includes(this.searchText),
      ),
    );
    console.log(this.filteredList);
  }

  confirm(item: any) {
    Confirmation.confirm(
      this.confirmationService,
      this.translate,
      'Are you sure you want to mark this as paid?',
      () => {
        item.loading = true;
        this.service.markAsPaid(item);
      },
    );
  }
  from: any;
  to: any;
  changeDate() {
    if (
      Array.isArray(this.date) &&
      this.date.length > 1 &&
      this.date.every(
        (item) => item !== null && item !== undefined && item !== '',
      )
    ) {
      console.log(this.date);
      this.from = new Date(structuredClone(this.date[0]));
      this.to = new Date(structuredClone(this.date[1]));
      this.service.filterAttendances();
    }
  }
}
