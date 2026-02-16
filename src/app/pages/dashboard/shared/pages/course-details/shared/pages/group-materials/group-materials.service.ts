import { inject, Injectable } from '@angular/core';
import { TopicRequestModel } from '../../../../../models/topic-request.model';
import { SubtopicModel } from '../../../../../models/subtopic.model';
import { TopicMaterialModel } from '../../../../../models/topic-material.model';
import { MaterialUpsertComponent } from './shared/components/material-upsert/material-upsert.component';
import { TopicApiService } from '../../../../../services/topic.api.service';
import { StorageService } from '../../../../../../../../core/services/storage.service';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { GroupMaterialsComponent } from './group-materials.component';
import { CoursesApiService } from '../../../../../../../admin-courses/shared/services/courses.api.service';

@Injectable({
  providedIn: 'root',
})
export class GroupMaterialsService {
  component: GroupMaterialsComponent;
  private translate: TranslateService = inject(TranslateService);
  private topicsService: TopicApiService = inject(TopicApiService);
  private storage: StorageService = inject(StorageService);
  public dialogService: DialogService = inject(DialogService);
  public courseService: CoursesApiService = inject(CoursesApiService);
  constructor() {}

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
    this.component.topic.courseId = this.component.courseId;
    const req = {
      id: this.component.courseId,
      lang: this.translate.currentLang,
    };
    this.topicsService.GetAllByCourse(req).subscribe((resp) => {
      this.component.topics = resp.data;
      this.component.topics.forEach((x) => (x.subTopic = new SubtopicModel()));
      this.component.expanderStates = Array.from(
        { length: this.component.topics.length },
        () => 'expanded',
      );
    });
  }

  addTopic() {
    this.component.topic.courseId = this.component.courseId;
    this.topicsService
      .Create(this.topicsService.serviceUrl, this.component.topic)
      .subscribe((resp) => {
        this.getAllTopics();
        this.component.topic = new TopicRequestModel();
      });
  }

  updateTopic() {
    this.component.topic.courseId = this.component.courseId;
    this.topicsService
      .Update(this.topicsService.serviceUrl, this.component.topic)
      .subscribe((resp) => {
        this.getAllTopics();
        this.component.topic = new TopicRequestModel();
      });
  }

  deleteTopic() {
    let ids: any[] = [this.component.topic.id];
    const req = {
      educatorId: localStorage.getItem('userId'),
      ids: ids,
    };

    this.topicsService.DeleteTopics(req).subscribe((resp) => {
      this.getAllTopics();
      this.component.topic = new TopicRequestModel();
    });
  }

  copyTopic() {
    let auth = this.storage.getObject('authResponse');
    const req = {
      educatorId: auth.id,
      topicId: this.component.topic.id,
    };
    this.topicsService.Copy(req).subscribe((resp) => {
      this.getAllTopics();
      this.component.topic = new TopicRequestModel();
    });
  }

  addSubTopic() {
    delete this.component.topic.subTopic.index;
    this.component.topic.subTopic.topicId = this.component.topic.id;
    this.topicsService
      .AddSubtopic(this.component.topic.subTopic)
      .subscribe((resp) => {
        this.getAllTopics();
        this.component.topic = new TopicRequestModel();
      });
  }

  updateSubtopic() {
    this.topicsService
      .EditSubtopic(this.component.topic.subTopic)
      .subscribe((resp) => {
        this.getAllTopics();
        this.component.topic = new TopicRequestModel();
      });
  }

  deleteSubTopic() {
    let ids: any[] = [this.component.topic.subTopic.id];
    const req = {
      educatorId: localStorage.getItem('userId'),
      ids: ids,
    };
    this.topicsService.DeleteSubtopics(req).subscribe((resp) => {
      this.getAllTopics();
      this.component.selectedSubTopic = new SubtopicModel();
    });
  }

  openDialog(sub: SubtopicModel, material: TopicMaterialModel) {
    const ref = this.dialogService.open(MaterialUpsertComponent, {
      header: 'File',
      width: '460px',
      data: {
        subTopic: sub,
        material: material,
        courseId: this.component.courseId,
        course:this.component.course
      },
      style: {
        maxWidth: '95%',
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.getAllTopics();
      }
    });
  }

  openTopicMaterialDialog(topic: any) {
    let sub = new SubtopicModel();
    sub.id = topic.id;
    const ref = this.dialogService.open(MaterialUpsertComponent, {
      header: 'File',
      width: '460px',
      data: {
        subTopic: sub,
        material: new TopicMaterialModel(),
        courseId: this.component.courseId,
        course:this.component.course
      },
      style: {
        maxWidth: '95%',
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.getAllTopics();
      }
    });
  }

  deleteMaterial() {
    let ids: any[] = [this.component.selectedMaterial.id];
    const req = {
      educatorId: localStorage.getItem('userId'),
      ids: ids,
    };
    this.topicsService.DeleteFiles(req).subscribe((resp) => {
      this.getAllTopics();
      this.component.selectedSubTopic = new SubtopicModel();
      this.component.selectedMaterial = new TopicMaterialModel();
    });
  }

  reIndexTopics() {
    const req = {
      courseId: this.component.courseId,
      topics: this.component.topics.map((item) => ({
        id: item.id,
        index: item.index,
      })),
    };
    console.log(req);
    this.topicsService.ReIndex(req).subscribe((resp) => {});
  }

  reIndexSubTopics(topic: TopicRequestModel) {
    const req = {
      topicId: topic.id,
      subtopics: topic.subtopics.map((item) => ({
        id: item.id,
        index: item.index,
      })),
    };
    console.log(req);
    this.topicsService.ReIndexSubtopics(req).subscribe((resp) => {});
  }

  removeItems() {
    let topics = this.component.topics.filter((item) => item.selected);
    if (topics.length > 0) {
      this.removeTopics(topics, () => {
        this.checkSubTopics();
      });
    } else {
      this.checkSubTopics();
    }
  }

  checkSubTopics() {
    let subTopics: any[] = [];
    this.component.topics.forEach((item) => {
      subTopics.push(...item.subtopics.filter((item) => item.selected));
    });
    if (subTopics.length > 0) {
      this.removeSubTopics(subTopics, () => {
        this.checkMaterials();
      });
    } else {
      this.checkMaterials();
    }
  }

  checkMaterials() {
    let materials: any[] = [];
    this.component.topics.forEach((item) => {
      item.subtopics.forEach((sub) => {
        materials.push(...sub.files.filter((mat) => mat.selected));
      });
      materials.push(...item.files.filter((mat) => mat.selected));
    });

    if (materials.length > 0) {
      this.removeMaterials(materials);
    } else {
      this.getAllTopics();
      this.component.loadingRemoval = false;
      this.component.allSelected = false;
      this.component.enableSelection = false;
      console.log('select yoxdu');
    }
  }

  private removeTopics(topics: TopicRequestModel[], callback: any) {
    const req = {
      educatorId: localStorage.getItem('userId') as string,
      ids: topics.map((x) => x.id),
    };
    console.log(req);
    this.topicsService.DeleteTopics(req).subscribe(
      (resp) => {
        callback(resp);
      },
      (error) => {
        this.component.loadingRemoval = false;
        this.component.allSelected = false;
        this.component.enableSelection = false;
      },
    );
  }

  private removeSubTopics(subTopics: any[], callBack: any) {
    const req = {
      educatorId: localStorage.getItem('userId') as string,
      ids: subTopics.map((x) => x.id),
    };
    console.log(req, 'subs');
    this.topicsService.DeleteSubtopics(req).subscribe(
      (resp) => {
        callBack(resp);
      },
      (error) => {
        this.component.loadingRemoval = false;
        this.component.allSelected = false;
        this.component.enableSelection = false;
      },
    );
  }

  private removeMaterials(materials: any[]) {
    const req = {
      educatorId: localStorage.getItem('userId') as string,
      ids: materials.map((x) => x.id),
    };
    console.log(req, 'mats');
    this.topicsService.DeleteFiles(req).subscribe(
      (resp) => {
        this.getAllTopics();
        this.component.loadingRemoval = false;
        this.component.allSelected = false;
        this.component.enableSelection = false;
      },
      (error) => {
        this.component.loadingRemoval = false;
        this.component.allSelected = false;
        this.component.enableSelection = false;
      },
    );
  }
}
