import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InviteStudentDialogService } from './invite-student-dialog.service';
import { TranslatePipe } from '@ngx-translate/core';
import {
  FormBuilder, FormControl,
  FormGroup,
  FormsModule, ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {ApplicationMessageCenterService} from '../../../../../../../../core/services/ApplicationMessageCenter.service';

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
  public  message = inject(ApplicationMessageCenterService)
  groupId: string = this.config.data;
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
      this.service.createGroupMember();
    }
    else{
      this.message.showTranslatedWarningMessage('Fields are not valid');
    }
  }
}
