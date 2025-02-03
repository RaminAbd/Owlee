import {Component, inject} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Popover} from 'primeng/popover';
import {FormsModule} from '@angular/forms';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {TopicRequestModel} from '../../../../../models/topic-request.model';
import {SubtopicModel} from '../../../../../models/subtopic.model';
import {TopicMaterialModel} from '../../../../../models/topic-material.model';
import {GroupMaterialsService} from './group-materials.service';
import {ConfirmationService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseRequestModel} from '../../../../../models/course-request.model';

@Component({
  selector: 'app-group-materials',
  imports: [
    NgClass,
    TranslatePipe,
    NgForOf,
    Popover,
    FormsModule,
    Dialog,
    Button,
    ConfirmDialog,
  ],
  templateUrl: './group-materials.component.html',
  styleUrl: './group-materials.component.scss',
})
export class GroupMaterialsComponent {
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);
  private service: GroupMaterialsService = inject(GroupMaterialsService);
  private translate: TranslateService = inject(TranslateService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  selectedTopic: TopicRequestModel = new TopicRequestModel();
  selectedSubTopic: SubtopicModel = new SubtopicModel();
  subTopic: SubtopicModel = new SubtopicModel();
  visible: boolean = false;
  topic: TopicRequestModel = new TopicRequestModel();
  topics: TopicRequestModel[] = [];
  courseId = this.route.parent?.snapshot.paramMap.get('id') as string;

  // groupId = this.route.parent?.snapshot.paramMap.get('groupId') as string;
  selectedMaterial: TopicMaterialModel = new TopicMaterialModel();
  course: CourseRequestModel = new CourseRequestModel();
  constructor() {
    this.service.component = this;
    this.service.getAllTopics();
    this.service.getCourse();
    // this.topic.groupId = this.groupId;
    this.topic.courseId = this.courseId;
  }

  back() {
    this.router.navigate(['/main/educator/dashboard']);
  }

  openToolbar(topic: TopicRequestModel) {
    this.selectedTopic = structuredClone(topic);
  }

  addTopic() {
    delete this.topic.index;
    this.service.addTopic();
  }

  updateTopic() {
    this.visible = false;
    this.service.updateTopic();
  }

  copyTopic() {
    this.confirm('Are you sure you want to copy this topic?', () => {
      this.service.copyTopic();
    });
  }

  deleteTopic() {
    this.confirm('Are you sure you want to delete this topic?', () => {
      this.service.deleteTopic();
    });
  }


  handleSubTools(topic: TopicRequestModel, sub: SubtopicModel) {
    this.selectedTopic = structuredClone(topic);
    this.selectedTopic.subTopic = structuredClone(sub);
  }

  handleSubTopic(topic: TopicRequestModel) {
    if (topic.subTopic.id) {
      this.service.updateSubtopic(topic);
    } else {
      this.service.addSubTopic(topic);
    }
  }

  editSubTopic() {
    let finded = this.topics.find((x) => x.id == this.selectedTopic.id);
    if (finded) {
      finded.subTopic = this.selectedTopic.subTopic;
    }
  }

  deleteSubTopic() {
    this.confirm('Are you sure you want to delete this sub topic?', () => {
      this.service.deleteSubTopic();
    });
  }


  openMaterialDialog(
    topic: TopicRequestModel,
    sub: SubtopicModel,
    mat?: TopicMaterialModel,
  ) {
    this.service.openDialog(sub, mat ?? new TopicMaterialModel());
  }

  handleMatTools(sub: SubtopicModel, mat: TopicMaterialModel) {
    this.selectedSubTopic = structuredClone(sub);
    this.selectedMaterial = structuredClone(mat);
  }

  deleteMaterial() {
    this.confirm('Are you sure you want to delete this file?', () => {
      this.service.deleteMaterial();
    });
  }

  editMaterial() {
    this.service.openDialog(this.selectedSubTopic, this.selectedMaterial);
  }


  confirm(message: string, success: any) {
    this.confirmationService.confirm({
      header: this.translate.instant('Confirmation'),
      message: message,
      icon: 'pi pi-exclamation-circle',
      rejectButtonProps: {
        label: this.translate.instant('Cancel'),
        icon: 'pi pi-times',
        outlined: true,
        size: 'small',
      },
      acceptButtonProps: {
        label: this.translate.instant('Confirm'),
        icon: 'pi pi-check',
        size: 'small',
      },
      accept: () => {
        success();
      },
      reject: () => {
      },
    });
  }
}
