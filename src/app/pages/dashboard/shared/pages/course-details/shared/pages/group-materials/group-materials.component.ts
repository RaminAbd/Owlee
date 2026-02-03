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
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
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
    NgClass,
    LottieComponent,
  ],
  templateUrl: './group-materials.component.html',
  styleUrl: './group-materials.component.scss',
  animations: [
    trigger('expanderAnimation', [
      state(
        'collapsed',
        style({
          maxHeight: '0px',
          opacity: 0,
        }),
      ),
      state(
        'expanded',
        style({
          maxHeight: '*',
          opacity: 1,
        }),
      ),
      transition('collapsed <=> expanded', [animate('0.3s ease-out')]),
    ]),
  ],
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
  expanderStates: string[] = [];
  allSelected: boolean = false;
  loadingRemoval: boolean = false;
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
    this.checkAllSelection();
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
    this.checkAllSelection();
  }

  subTopicSelectionChange(topic: TopicRequestModel, sub: SubtopicModel) {
    let selectedSubs = topic.subtopics.filter(
      (sub: SubtopicModel) => sub.selected,
    );
    let selectedMaterials = topic.files.filter(
      (sub: TopicMaterialModel) => sub.selected,
    );
    topic.selected =
      selectedSubs.length === topic.subtopics.length &&
      selectedMaterials.length === topic.files.length;
    sub.files.forEach((file) => {
      file.selected = sub.selected;
    });
    this.checkAllSelection();
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
    this.checkAllSelection();
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

    let selectedSubs = topic.subtopics.filter(
      (sub: SubtopicModel) => sub.selected,
    );
    if (
      selectedMaterials.length === topic.files.length &&
      selectedSubs.length === topic.subtopics.length
    )
      topic.selected = true;
    else topic.selected = false;
    this.checkAllSelection();
  }

  checkAllSelection() {
    let selectedTopics = this.topics.filter((topic: any) => topic.selected);
    this.allSelected = this.topics.length == selectedTopics.length;
  }

  removeItems() {
    this.loadingRemoval = true;
    this.service.removeItems();
  }

  openMaterialDialogForTopic(topic: TopicRequestModel) {
    this.service.openTopicMaterialDialog(topic);
  }

  toggleExpander(index: number) {
    this.expanderStates[index] =
      this.expanderStates[index] === 'collapsed' ? 'expanded' : 'collapsed';
  }

  allSelectionChange() {
    this.topics.forEach((topic, index) => {
      topic.selected = this.allSelected;
      topic.files.forEach((file) => {
        file.selected = this.allSelected;
      });
      topic.subtopics.forEach((sub: SubtopicModel) => {
        sub.selected = this.allSelected;
        sub.files.forEach((file) => {
          file.selected = this.allSelected;
        });
      });
    });
  }

  private animationItem: AnimationItem | undefined;
  mainLoading: boolean = false;
  options: AnimationOptions = {
    path: 'Animation.json',
    loop: true,
    autoplay: false,
  };

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    if (this.animationItem) {
      this.animationItem.play();
    }
  }
}
