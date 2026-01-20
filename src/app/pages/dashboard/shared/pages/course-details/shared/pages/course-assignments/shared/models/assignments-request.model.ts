import { FileModel } from '../../../../../../../../../../core/models/File.model';
import {SubmittedStudentModel} from './submitted-student.model';

export class AssignmentsRequestModel {
  id: string;
  educatorId: string;
  courseId: string;
  groupIds: string[] = [];
  title: string;
  description: string;
  files: FileModel[] = [];
  availableFrom: string;
  availableTo: string;
  fakeFiles: any[] = [];
  file: FileModel = new FileModel();
  students: SubmittedStudentModel[] = [];
  appliedStudents: SubmittedStudentModel[] = [];
  groups: string;
  submittedStudents: number;
  totalStudents: number;
  studentFiles: FileModel[] = [];
  answer: string;
  submitted: boolean;
}
