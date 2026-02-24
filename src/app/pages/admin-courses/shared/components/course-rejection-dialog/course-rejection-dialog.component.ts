import {Component, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-course-rejection-dialog',
  imports: [FormsModule, NgIf, TranslatePipe],
  templateUrl: './course-rejection-dialog.component.html',
  styleUrl: './course-rejection-dialog.component.scss',
})
export class CourseRejectionDialogComponent {
  public ref:DynamicDialogRef = inject(DynamicDialogRef);
  reason: string = '';

  save() {
    this.ref.close(this.reason)
  }
}
