import { SubtopicModel } from './subtopic.model';

export class TopicRequestModel {
  id: string;
  courseId: string;
  groupId: string;
  name: string;
  index?: number;
  subTopic:SubtopicModel = new SubtopicModel();
  subtopics: SubtopicModel[] = [];
}
