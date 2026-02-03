import { Component, inject } from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { EducatorSignupRequestModel } from '../../../../../../../../../../../../../auth/sign-up/shared/models/educator-signup-request.model';
import { StudentSignupRequestModel } from '../../../../../../../../../../../../../auth/student-sign-up/shared/models/student-signup-request.model';
import { MemberDetailsService } from './member-details.service';
import { ActivatedRoute } from '@angular/router';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {
  PaymentsResponseModel
} from '../../../../../../../../../../../../educator-plans/shared/models/payments-response.model';
import {Confirmation} from '../../../../../../../../../../../../../core/extensions/confirmation';
import {ConfirmationService} from 'primeng/api';
import {GroupMembersResponseModel} from '../../../../../../../../../../models/group-members.response.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-member-details',
  imports: [TranslatePipe, NgClass, DatePipe, FormsModule, NgForOf, NgIf],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.scss',
})
export class MemberDetailsComponent {
  private service: MemberDetailsService = inject(MemberDetailsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private translate: TranslateService = inject(TranslateService);
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);
  member: GroupMembersResponseModel = new GroupMembersResponseModel()
  student: StudentSignupRequestModel = new StudentSignupRequestModel();
  id = this.route.snapshot.paramMap.get('id') as string;
  courseId = this.route.parent?.parent?.snapshot.paramMap.get('id') as string;

  selectedTab: number = 1;
  payments: PaymentsResponseModel[] = [];
  filteredList: PaymentsResponseModel[] = [];
  searchText: string;
  constructor() {
    console.log(this.courseId, 'courseId')
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
}
