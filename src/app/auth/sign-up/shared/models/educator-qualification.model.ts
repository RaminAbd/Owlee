import { FileModel } from '../../../../core/models/File.model';

export class EducatorQualificationModel {
  id: string;
  title: string;
  file: FileModel = new FileModel();
}
