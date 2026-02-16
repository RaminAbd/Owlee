import { Component, OnDestroy } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MaterialUpsertService } from './material-upsert.service';
import { TopicMaterialModel } from '../../../../../../../../models/topic-material.model';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
import { KnownLanguagesResponseModel } from '../../../../../../../../../../known-languages/shared/models/known-languages-response.model';
import { SubtopicModel } from '../../../../../../../../models/subtopic.model';
import { UserSubscriptionResponseModel } from '../../../../../../../../models/user-subscription-response.model';
import { SizeRequestModel } from '../../../../../../../../models/size-request.model';
import { NgIf, NgStyle } from '@angular/common';
import { Checkbox } from 'primeng/checkbox';
import { DatePicker } from 'primeng/datepicker';
import { CourseRequestModel } from '../../../../../../../../models/course-request.model';
import {
  ApplicationMessageCenterService
} from '../../../../../../../../../../../core/services/ApplicationMessageCenter.service';

@Component({
  selector: 'app-material-upsert',
  imports: [
    DropdownModule,
    ReactiveFormsModule,
    TranslatePipe,
    FormsModule,
    NgStyle,
    Checkbox,
    NgIf,
    DatePicker,
  ],
  templateUrl: './material-upsert.component.html',
  styleUrl: './material-upsert.component.scss',
})
export class MaterialUpsertComponent implements OnDestroy {
  request: TopicMaterialModel = new TopicMaterialModel();
  subtopic: SubtopicModel = new SubtopicModel();
  languages: KnownLanguagesResponseModel[] = [];
  langSubscribtion: any;
  subscription: UserSubscriptionResponseModel =
    new UserSubscriptionResponseModel();
  size: SizeRequestModel = new SizeRequestModel();
  enableSelection: boolean = false;
  startDate: any;
  endDate: any;
  courseId: string;
  loading: boolean = false;
  course: CourseRequestModel = new CourseRequestModel();

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private service: MaterialUpsertService,
    private message: ApplicationMessageCenterService,
  ) {
    this.service.component = this;
    this.request = structuredClone(config.data.material);
    this.subtopic = structuredClone(config.data.subTopic);
    this.courseId = this.config.data.courseId;
    this.course = this.config.data.course;
    this.service.getKnownLangs();

    this.service.getSubscription();
    this.langSubscribtion = this.service.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.service.getKnownLangs();
      },
    );
  }

  getImage(e: any) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    let total = this.course.isOpen
      ? this.subscription.openMaxFileStorage
      : this.subscription.maxFileStorage;

    const file: any = input.files[0];
    file.fileMB = (file.size / 1024 / 1024).toFixed(2);
    let mb = file.fileMB;
    this.subscription.used = this.subscription.fileStorage + Number(mb);
    this.subscription.usedPercentage = (this.subscription.used / total) * 100;
    if(this.subscription.used > total){
      this.message.showTranslatedWarningMessage('Not enough storage space')
      return;
    }
    this.request.fakeFile = file;


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

  removeFile() {
    this.request.fakeFile = undefined;
  }

  save() {
    this.loading = true;
    console.log(this.request)
    this.service.save();
  }

  upgradePlan(){
    this.service.upgradePlan()
  }

  ngOnDestroy() {
    this.langSubscribtion.unsubscribe();
  }
}
