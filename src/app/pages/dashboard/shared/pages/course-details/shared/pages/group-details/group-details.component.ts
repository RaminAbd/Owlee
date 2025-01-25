import { Component, inject } from '@angular/core';
import { Location, NgClass, NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CourseRequestModel } from '../../../../../models/course-request.model';
import { GroupDetailsService } from './group-details.service';
import { TranslatePipe } from '@ngx-translate/core';
import { GroupRequestModel } from '../../../../../models/group-request.model';
import { TopicRequestModel } from '../../../../../models/topic-request.model';
import { Popover } from 'primeng/popover';
import { SubtopicModel } from '../../../../../models/subtopic.model';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { TopicMaterialModel } from '../../../../../models/topic-material.model';
import {GroupMembersComponent} from '../../components/group-members/group-members.component';
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
  selector: 'app-group-details',
  imports: [
    NgClass,
    TranslatePipe,
    NgForOf,
    Popover,
    NgIf,
    FormsModule,
    Dialog,
    Button,
    GroupMembersComponent,
    ConfirmDialog
  ],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.scss',
})
export class GroupDetailsComponent {
  public service: GroupDetailsService = inject(GroupDetailsService);
  public location: Location = inject(Location);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);

  courseId = this.route.parent?.snapshot.paramMap.get('id') as string;
  groupId = this.route.snapshot.paramMap.get('groupId') as string;
  course: CourseRequestModel = new CourseRequestModel();
  group: GroupRequestModel = new GroupRequestModel();
  selectedTab = 1;
  topics: TopicRequestModel[] = [];
  topic: TopicRequestModel = new TopicRequestModel();
  selectedTopic: TopicRequestModel = new TopicRequestModel();
  selectedSubTopic: SubtopicModel = new SubtopicModel();
  subTopic: SubtopicModel = new SubtopicModel();
  visible: boolean = false;
  constructor() {
    this.service.component = this;
    this.service.getCourse();
    this.service.getGroup();
    this.service.getAllTopics();
    this.topic.groupId = this.groupId;
    this.topic.courseId = this.courseId;
  }
  back() {
    this.router.navigate([
      '/main/educator/dashboard/course/info',
      this.courseId,
      'groups',
    ]);
  }

  openToolbar(topic: TopicRequestModel) {
    this.selectedTopic = structuredClone(topic);
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

  addTopic() {
    delete this.topic.index;
    console.log(this.topic);
    this.service.addTopic();
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

  handleSubTools(topic: TopicRequestModel, sub: SubtopicModel) {
    this.selectedTopic = structuredClone(topic);
    this.selectedTopic.subTopic = structuredClone(sub);
  }

  updateTopic() {
    console.log(this.selectedTopic);
    this.visible = false;
    this.service.updateTopic();
  }

  confirm(message: string, success: any) {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: message,
      icon: 'pi pi-exclamation-circle',
      rejectButtonProps: {
        label: 'Cancel',
        icon: 'pi pi-times',
        outlined: true,
        size: 'small',
      },
      acceptButtonProps: {
        label: 'Confirm',
        icon: 'pi pi-check',
        size: 'small',
      },
      accept: () => {
        success();
      },
      reject: () => {},
    });
  }

  openMaterialDialog(
    topic: TopicRequestModel,
    sub: SubtopicModel,
    mat?: TopicMaterialModel,
  ) {
    this.service.openDialog(sub, mat ?? new TopicMaterialModel());
  }
  selectedMaterial: TopicMaterialModel = new TopicMaterialModel();
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
}
