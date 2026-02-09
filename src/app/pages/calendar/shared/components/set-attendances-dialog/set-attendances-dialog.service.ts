import { inject, Injectable } from '@angular/core';
import { SetAttendancesDialogComponent } from './set-attendances-dialog.component';
import { AttendancesApiService } from '../../services/attendances.api.service';

@Injectable({
  providedIn: 'root',
})
export class SetAttendancesDialogService {
  private service: AttendancesApiService = inject(AttendancesApiService);

  component: SetAttendancesDialogComponent;

  constructor() {}

  setAttendances() {
    this.component.loading = true;
    const req = {
      meetingId: this.component.meeting.id,
      studentIds: this.component.selectedStudents,
    };
    this.service.Set(req).subscribe(
      (resp) => {
        this.component.loading = false;
        if (resp.succeeded) {
          this.component.ref.close(true);
        }
      },
      (error) => (this.component.loading = false),
    );
  }
}
