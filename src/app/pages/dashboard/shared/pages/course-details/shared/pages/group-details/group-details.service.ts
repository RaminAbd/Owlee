import { inject, Injectable } from '@angular/core';
import { CourseGroupsComponent } from '../course-groups/course-groups.component';
import { GroupDetailsComponent } from './group-details.component';
import { CoursesApiService } from '../../../../../../../admin-courses/shared/services/courses.api.service';
import { GroupsApiService } from '../../../../../services/groups.api.service';
import { TranslateService } from '@ngx-translate/core';
import { TopicApiService } from '../../../../../services/topic.api.service';
import { SubtopicModel } from '../../../../../models/subtopic.model';
import { TopicRequestModel } from '../../../../../models/topic-request.model';
import { StorageService } from '../../../../../../../../core/services/storage.service';
import {GroupUpsertComponent} from '../../components/group-upsert/group-upsert.component';
import {MaterialUpsertComponent} from '../../components/material-upsert/material-upsert.component';
import {TopicMaterialModel} from '../../../../../models/topic-material.model';
import {DialogService} from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class GroupDetailsService {
  component: GroupDetailsComponent;
  private coursesService: CoursesApiService = inject(CoursesApiService);
  private service: GroupsApiService = inject(GroupsApiService);
  private translate: TranslateService = inject(TranslateService);
  private topicsService: TopicApiService = inject(TopicApiService);
  private storage: StorageService = inject(StorageService);
  public dialogService: DialogService = inject(DialogService);
  getCourse() {
    const req = {
      id: this.component.courseId,
      lang: this.translate.currentLang,
    };
    this.coursesService
      .GetByIdByLang(this.coursesService.serviceUrl, req)
      .subscribe((resp) => {
        this.component.course = resp.data;
      });
  }

  getGroup() {
    this.service
      .GetById(this.service.serviceUrl, this.component.groupId)
      .subscribe((resp) => {
        this.component.group = resp.data;
      });
  }

  getAllTopics() {
    const req = {
      groupId: this.component.groupId,
      lang: this.translate.currentLang,
    };
    this.topicsService.GetAllByGroup(req).subscribe((resp) => {
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
