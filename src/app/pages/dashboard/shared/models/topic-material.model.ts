import {FileModel} from '../../../../core/models/File.model';

export class TopicMaterialModel {
  id: string;
  subtopicId: string;
  systemLanguageId: string;
  index?: number;
  name: string;
  url: string;
  language: string;
  icon: string;
  selected: boolean;
  file: FileModel = new FileModel();
  fakeFile: any;
  availableFrom:any;
  availableTo:any
}
