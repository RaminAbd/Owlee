import { Component, inject, OnDestroy } from '@angular/core';
import { CoursesUpsertService } from './courses-upsert.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location, NgClass, NgForOf, NgIf } from '@angular/common';
import { KnownLanguagesResponseModel } from '../../../../known-languages/shared/models/known-languages-response.model';
import { CourseRequestModel } from '../../models/course-request.model';
import { FormsModule } from '@angular/forms';
import { LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
import { DatePicker } from 'primeng/datepicker';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CalendarMeetingEditComponent } from '../../../../calendar/shared/components/calendar-meeting-edit/calendar-meeting-edit.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CourseAdComponent } from '../../components/course-ad/course-ad.component';

@Component({
  selector: 'app-courses-upsert',
  imports: [
    FormsModule,
    NgIf,
    NgClass,
    NgForOf,
    TranslatePipe,
    DatePicker,
    ToggleSwitch,
    RouterLink,
  ],
  templateUrl: './courses-upsert.component.html',
  styleUrl: './courses-upsert.component.scss',
})
export class CoursesUpsertComponent implements OnDestroy {
  private service: CoursesUpsertService = inject(CoursesUpsertService);
  private dialogService: DialogService = inject(DialogService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  public location: Location = inject(Location);
  id = this.route.snapshot.paramMap.get('id') as string;
  languages: KnownLanguagesResponseModel[] = [];
  request: CourseRequestModel = new CourseRequestModel();
  isSubmitted = false;
  langSubscribtion: any;
  endDate: any;
  startDate: any;
  lastDay: any;
  privacyAccepted: boolean = false;
  constructor() {
    this.service.component = this;
    this.service.getKnownLangs();

    this.langSubscribtion = this.service.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.service.getKnownLangs();
      },
    );
  }

  getFile(e: any) {
    this.request.image.fileLoading = true;
    this.service.getFile(e);
  }

  getFileName(fileName: string): string {
    if (fileName) {
      if (fileName.length > 30) {
        return this.changeFileName(fileName);
      } else {
        return fileName;
      }
    } else {
      return '';
    }
  }

  changeFileName(name: string) {
    return (
      name.substring(0, 10) +
      '...' +
      name.substring(name.length - 5, name.length)
    );
  }

  save() {
    this.isSubmitted = true;
    if (this.request.isOpen) {
      if (this.privacyAccepted) {
        this.service.save();
      }
    } else {
      this.showAd();
    }
  }

  ngOnDestroy() {
    this.langSubscribtion.unsubscribe();
  }

  removeItem(i: number) {
    this.request.learningPoints.splice(i, 1);
  }

  addItem() {
    let item = { value: '' };
    this.request.learningPoints.push(item);
  }

  private showAd() {
    const ref = this.dialogService.open(CourseAdComponent, {
      width: '500px',
      height: '420px',
      style: {
        maxWidth: '95%',
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        // this.service.getAllMeetings();
      }
      this.service.save();
    });
  }
}
