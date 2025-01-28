import { FileModel } from '../../../../core/models/File.model';
import { EducatorQualificationModel } from './educator-qualification.model';

export class EducatorSignupRequestModel {
  id:string;
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
  oldPassword: string;
  qualifications: EducatorQualificationModel[] = [];
  systemLanguages: string[] = [];
  userName:string;
  day:any;
  month:any;
  year:any;
  personalId:string;
}
