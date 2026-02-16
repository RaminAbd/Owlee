import {Component, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-course-ad',
  imports: [
    TranslatePipe
  ],
  templateUrl: './course-ad.component.html',
  styleUrl: './course-ad.component.scss'
})
export class CourseAdComponent {
  ref:DynamicDialogRef = inject(DynamicDialogRef)
}
