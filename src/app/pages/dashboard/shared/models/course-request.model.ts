import { FileModel } from '../../../../core/models/File.model';

export class CourseRequestModel {
  id: string;
  educatorId: string;
  systemLanguageId: string;
  image: FileModel = new FileModel();
  name: string;
  description: string;
}
