import { FileModel } from '../../../../core/models/File.model';
import { EducatorQualificationModel } from './educator-qualification.model';

export class EducatorSignupRequestModel {
  verificationCode: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  profileImage: FileModel = new FileModel();
  location: string;
  password: string;
  confirmPassword: string;
  qualifications: EducatorQualificationModel[] = [];
  systemLanguages: string[] = [];
}
