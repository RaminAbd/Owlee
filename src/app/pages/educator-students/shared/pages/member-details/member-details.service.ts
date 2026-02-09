import { inject, Injectable } from '@angular/core';
import { MemberDetailsComponent } from './member-details.component';
import { StudentsApiService } from '../../../../students/shared/services/students.api.service';
import { AttendancesApiService } from '../../../../calendar/shared/services/attendances.api.service';
import { GroupMembersApiService } from '../../../../dashboard/shared/services/group-members.api.service';
import { MonthlyPaymentsApiService } from '../../../../educator-plans/shared/services/monthly-payments.api.service';

@Injectable({
  providedIn: 'root',
})
export class MemberDetailsService {
  private studentsService: StudentsApiService = inject(StudentsApiService);
  private attendancesService: AttendancesApiService = inject(
    AttendancesApiService,
  );
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
        this.filterAttendances();
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
      StudentId: this.component.member.studentId,
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

  filterAttendances() {
    const req: any = {
      studentId: this.component.member.studentId,
    };
    if (this.component.from)
      req.FromDate = this.component.from.toISOString().split('T')[0];
    if (this.component.to)
      req.ToDate = this.component.to.toISOString().split('T')[0];
    this.attendancesService.Filter(req).subscribe((resp) => {
      this.component.attendances = resp.data;
      console.log(resp.data, 'attendances');
    });
  }
}
