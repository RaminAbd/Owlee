import { TopicMaterialModel } from './topic-material.model';

export class SubtopicModel {
  id: string;
  topicId: string;
  name: string;
  index: number;
  files: TopicMaterialModel[] = [];
}
