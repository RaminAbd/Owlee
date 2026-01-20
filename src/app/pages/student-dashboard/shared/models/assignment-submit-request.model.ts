import {FileModel} from '../../../../core/models/File.model';

export class AssignmentSubmitRequestModel {
  id: string
  answer: string
  files: FileModel[]=[]
  file:FileModel = new FileModel();
}
