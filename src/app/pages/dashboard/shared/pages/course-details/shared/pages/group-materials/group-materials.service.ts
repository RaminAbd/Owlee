import {inject, Injectable} from '@angular/core';
import {TopicRequestModel} from '../../../../../models/topic-request.model';
import {SubtopicModel} from '../../../../../models/subtopic.model';
import {TopicMaterialModel} from '../../../../../models/topic-material.model';
import {MaterialUpsertComponent} from '../../components/material-upsert/material-upsert.component';
import {TopicApiService} from '../../../../../services/topic.api.service';
import {StorageService} from '../../../../../../../../core/services/storage.service';
import {DialogService} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';
import {GroupMaterialsComponent} from './group-materials.component';
import {CoursesApiService} from '../../../../../../../admin-courses/shared/services/courses.api.service';

@Injectable({
  providedIn: 'root'
})
export class GroupMaterialsService {
  component:GroupMaterialsComponent
  private translate: TranslateService = inject(TranslateService);
  private topicsService: TopicApiService = inject(TopicApiService);
  private storage: StorageService = inject(StorageService);
  public dialogService: DialogService = inject(DialogService);
  public courseService: CoursesApiService = inject(CoursesApiService);
  constructor() { }

  getCourse() {
    const req = {
      id: this.component.courseId,
      lang: this.translate.currentLang,
    };
    this.courseService
      .GetByIdByLang(this.courseService.serviceUrl, req)
      .subscribe((resp) => {
        this.component.course = resp.data;
      });
  }

  getAllTopics() {
    const req = {
      id: this.component.courseId,
      lang: this.translate.currentLang,
    };
    this.topicsService.GetAllByCourse(req).subscribe((resp) => {
      this.component.topics = resp.data;
      this.component.topics.forEach((x) => (x.subTopic = new SubtopicModel()));
    });
  }

  addTopic() {
    this.topicsService
      .Create(this.topicsService.serviceUrl, this.component.topic)
      .subscribe((resp) => {
        this.getAllTopics();
        this.component.topic.name = '';
      });
  }

  updateTopic() {
    this.topicsService
      .Update(this.topicsService.serviceUrl, this.component.selectedTopic)
      .subscribe((resp) => {
        this.getAllTopics();
        this.component.selectedTopic = new TopicRequestModel();
      });
  }

  deleteTopic() {
    this.topicsService
      .Delete(this.topicsService.serviceUrl, this.component.selectedTopic.id)
      .subscribe((resp) => {
        this.getAllTopics();
        this.component.selectedTopic = new TopicRequestModel();
      });
  }

  copyTopic() {
    let auth = this.storage.getObject('authResponse');
    const req = {
      educatorId: auth.id,
      topicId: this.component.selectedTopic.id,
    };
    this.topicsService.Copy(req).subscribe((resp) => {
      this.getAllTopics();
      this.component.selectedTopic = new TopicRequestModel();
    });
  }




  addSubTopic(topic: TopicRequestModel) {
    delete topic.subTopic.index;
    topic.subTopic.topicId = topic.id;
    console.log(topic, 'create');
    this.topicsService.AddSubtopic(topic.subTopic).subscribe((resp) => {
      this.getAllTopics();
      topic.subTopic.name = '';
    });
  }

  updateSubtopic(topic: TopicRequestModel) {
    this.topicsService.EditSubtopic(topic.subTopic).subscribe((resp) => {
      this.getAllTopics();
      topic.subTopic.name = '';
      topic.subTopic.id = '';
    });
  }

  deleteSubTopic() {
    this.topicsService
      .DeleteSubTopic(this.topicsService.serviceUrl, this.component.selectedTopic.subTopic.id)
      .subscribe((resp) => {
        this.getAllTopics();
        this.component.selectedSubTopic = new SubtopicModel();
      });
  }

  openDialog(sub:SubtopicModel,material:TopicMaterialModel) {
    const ref = this.dialogService.open(MaterialUpsertComponent, {
      header: 'File',
      width: '460px',
      data: {
        subTopic:sub,
        material:material,
      }
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.getAllTopics();
      }
    });
  }

  deleteMaterial() {
    this.topicsService
      .DeleteFile(this.topicsService.serviceUrl, this.component.selectedMaterial.id)
      .subscribe((resp) => {
        this.getAllTopics();
        this.component.selectedSubTopic = new SubtopicModel();
        this.component.selectedMaterial = new TopicMaterialModel();
      });
  }


}
