import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InviteStudentDialogService } from './invite-student-dialog.service';
import { TranslatePipe } from '@ngx-translate/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApplicationMessageCenterService } from '../../../../../../../../core/services/ApplicationMessageCenter.service';

@Component({
  selector: 'app-invite-student-dialog',
  imports: [TranslatePipe, ReactiveFormsModule],
  templateUrl: './invite-student-dialog.component.html',
  styleUrl: './invite-student-dialog.component.scss',
})
export class InviteStudentDialogComponent {
  public config: DynamicDialogConfig = inject(DynamicDialogConfig);
  public ref: DynamicDialogRef = inject(DynamicDialogRef);
  private service: InviteStudentDialogService = inject(
    InviteStudentDialogService,
  );
  private fb: FormBuilder = inject(FormBuilder);
  public message = inject(ApplicationMessageCenterService);
  groupId: string = this.config.data.groupId;
  members: any[] = this.config.data.members;
  email: string;
  isSubmitted: boolean = false;
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
  });
  constructor() {
    this.service.component = this;
  }

  save() {
    this.isSubmitted = true;
    if (this.form.valid) {
      let includes = this.members.some(
        (x: any) => x.email === this.form.value.email,
      );
      console.log(this.members, includes, this.form.value.email);
      if (!includes) {
        this.service.createGroupMember();
      } else {
        this.message.showTranslatedWarningMessage(
          'Member with given email already exists',
        );
      }
    } else {
      this.message.showTranslatedWarningMessage('Fields are not valid');
    }
  }
}
