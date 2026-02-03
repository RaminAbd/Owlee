import { inject, Injectable } from '@angular/core';
import { MemberDetailsComponent } from './member-details.component';
import { StudentsApiService } from '../../../../../../../../../../../../students/shared/services/students.api.service';
import { GroupMembersApiService } from '../../../../../../../../../../services/group-members.api.service';
import { MonthlyPaymentsApiService } from '../../../../../../../../../../../../educator-plans/shared/services/monthly-payments.api.service';

@Injectable({
  providedIn: 'root',
})
export class MemberDetailsService {
  private studentsService: StudentsApiService = inject(StudentsApiService);
  private membersService: GroupMembersApiService = inject(
    GroupMembersApiService,
  );
  private service: MonthlyPaymentsApiService = inject(
    MonthlyPaymentsApiService,
  );
  component: MemberDetailsComponent;

  constructor() {}
  getMember() {
    this.membersService
      .GetById(this.membersService.serviceUrl, this.component.id)
      .subscribe((resp) => {
        this.component.member = resp.data;
        this.getStudent(resp.data.studentId);
        this.filter();
      });
  }

  getStudent(id: string) {
    this.studentsService
      .GetById(this.studentsService.serviceUrl, id)
      .subscribe((resp) => {
        this.component.student = resp.data;
      });
  }

  filter() {
    const req = {
      EducatorId: localStorage.getItem('userId') as string,
      StudentId: this.component.member.studentId,
      CourseId: this.component.courseId,
    };
    this.service.Filter(req).subscribe((resp) => {
      console.log(resp.data);
      let data = resp.data.map((item: any) => ({
        ...item,
        student: item.firstName + ' ' + item.lastName,
      }));
      this.component.payments = structuredClone(data);
      this.component.filteredList = structuredClone(data);
    });
  }

  markAsPaid(item: any) {
    const req = {
      id: item.id,
    };
    this.service.MarkAsPaid(req).subscribe((resp) => {
      this.filter();
      item.loading = false;
    });
  }
}
