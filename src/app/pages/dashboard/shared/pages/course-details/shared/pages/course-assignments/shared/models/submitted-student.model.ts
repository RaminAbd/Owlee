import {FileModel} from '../../../../../../../../../../core/models/File.model';

export class SubmittedStudentModel {
  id: string
  firstName: string
  lastName: string
  submitted: boolean
  files: FileModel[]=[];
  answer: any
  submittedAt: any
  loadingFiles: boolean;
}
