import { Component, inject } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Popover } from 'primeng/popover';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TopicRequestModel } from '../../../../../models/topic-request.model';
import { SubtopicModel } from '../../../../../models/subtopic.model';
import { TopicMaterialModel } from '../../../../../models/topic-material.model';
import { GroupMaterialsService } from './group-materials.service';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseRequestModel } from '../../../../../models/course-request.model';
import { TopicUpsertComponent } from './shared/components/topic-upsert/topic-upsert.component';
import { SubTopicUpsertComponent } from './shared/components/sub-topic-upsert/sub-topic-upsert.component';
import { LanguageService } from '../../../../../../../../core/services/language.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Checkbox } from 'primeng/checkbox';
import { ToggleSwitch } from 'primeng/toggleswitch';
@Component({
  selector: 'app-group-materials',
  imports: [
    TranslatePipe,
    NgForOf,
    Popover,
    FormsModule,
    DragDropModule,
    Checkbox,
    ToggleSwitch,
    NgIf,
  ],
  templateUrl: './group-materials.component.html',
  styleUrl: './group-materials.component.scss',
})
export class GroupMaterialsComponent {
  private confirmationService: ConfirmationService =
    inject(ConfirmationService);
  private service: GroupMaterialsService = inject(GroupMaterialsService);
  private langService: LanguageService = inject(LanguageService);
  private translate: TranslateService = inject(TranslateService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  selectedSubTopic: SubtopicModel = new SubtopicModel();
  subTopic: SubtopicModel = new SubtopicModel();
  topic: TopicRequestModel = new TopicRequestModel();
  topics: TopicRequestModel[] = [];
  courseId = this.route.parent?.snapshot.paramMap.get('id') as string;
  selectedMaterial: TopicMaterialModel = new TopicMaterialModel();
  course: CourseRequestModel = new CourseRequestModel();
  enableSelection: boolean = false;
  constructor() {
    this.service.component = this;
    this.service.getAllTopics();
    this.service.getCourse();
    this.topic.courseId = this.courseId;
  }

  back() {
    this.router.navigate(['/main/educator/dashboard']);
  }

  openToolbar(topic: TopicRequestModel) {
    this.topic = structuredClone(topic);
  }

  addTopic() {
    delete this.topic.index;
    this.openTopicDialog(() => {
      this.service.addTopic();
    });
  }

  editTopic() {
    this.openTopicDialog(() => {
      this.service.updateTopic();
    });
  }

  openTopicDialog(callBack: any) {
    const ref = this.service.dialogService.open(TopicUpsertComponent, {
      header: this.langService.getByKey('Topic'),
      width: '460px',
      data: this.topic,
      style: {
        maxWidth: '95%',
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.topic = e;
        callBack();
      }
    });
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

  ///// Sub Topic

  addSubTopic(topic: TopicRequestModel) {
    this.topic = topic;
    this.openSubDialog(() => {
      this.service.addSubTopic();
    });
  }

  handleSubTools(topic: TopicRequestModel, sub: SubtopicModel) {
    this.topic = structuredClone(topic);
    this.topic.subTopic = structuredClone(sub);
  }

  editSubTopic() {
    this.openSubDialog(() => {
      this.service.updateSubtopic();
    });
  }

  openSubDialog(callBack: any) {
    const ref = this.service.dialogService.open(SubTopicUpsertComponent, {
      header: this.langService.getByKey('Subtopic'),
      width: '460px',
      data: this.topic,
      style: {
        maxWidth: '95%',
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        console.log(e);
        this.topic = e;
        callBack();
      }
    });
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

  handleTopicMatTools(topic: TopicRequestModel, mat: TopicMaterialModel) {
    this.topic = structuredClone(topic);
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
      reject: () => {},
    });
  }

  dropTopic(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.topics, event.previousIndex, event.currentIndex);
    this.updateTopicIndexes();
    this.service.reIndexTopics();
  }

  private updateTopicIndexes() {
    this.topics.forEach((topic, index) => {
      topic.index = index;
    });
  }

  dropSubTopic(event: CdkDragDrop<any[]>, topic: any) {
    moveItemInArray(topic.subtopics, event.previousIndex, event.currentIndex);
    this.updateSubIndexes(topic);
    this.service.reIndexSubTopics(topic);
  }
  private updateSubIndexes(topic: TopicRequestModel) {
    console.log(topic);
    topic.subtopics.forEach((topic, index) => {
      topic.index = index;
    });
  }

  changeSelectionState() {
    this.topics.forEach((topic, index) => {
      topic.selected = false;
      topic.subtopics.forEach((sub: SubtopicModel) => {
        sub.selected = false;
        sub.files.forEach((file) => {
          file.selected = false;
        });
      });
    });
  }

  topicSelectionChange(topic: TopicRequestModel) {
    topic.subtopics.forEach((sub: SubtopicModel) => {
      sub.selected = topic.selected;
      sub.files.forEach((file) => {
        file.selected = topic.selected;
      });
    });
    topic.files.forEach((file: any) => {
      file.selected = topic.selected;
    });
  }

  subTopicSelectionChange(topic: TopicRequestModel, sub: SubtopicModel) {
    let selectedSubs = topic.subtopics.filter(
      (sub: SubtopicModel) => sub.selected,
    );
    topic.selected = selectedSubs.length === topic.subtopics.length;
    sub.files.forEach((file) => {
      file.selected = sub.selected;
    });
  }

  fileSelectionChange(
    checked: boolean,
    topic: TopicRequestModel,
    sub: SubtopicModel,
    file: TopicMaterialModel,
  ) {
    file.selected = checked;
    let selectedMaterials = sub.files.filter(
      (sub: TopicMaterialModel) => sub.selected,
    );
    sub.selected = selectedMaterials.length === sub.files.length;
    this.subTopicSelectionChange(topic, sub);
  }

  topicFileSelectionChange(
    checked: boolean,
    topic: TopicRequestModel,

    file: TopicMaterialModel,
  ) {
    file.selected = checked;
    let selectedMaterials = topic.files.filter(
      (sub: TopicMaterialModel) => sub.selected,
    );
    topic.selected = selectedMaterials.length === topic.files.length;
    // this.subTopicSelectionChange(topic, sub);
  }

  removeItems() {
    this.service.removeItems();
  }

  openMaterialDialogForTopic(topic: TopicRequestModel) {
    this.service.openTopicMaterialDialog(topic);
  }

}
