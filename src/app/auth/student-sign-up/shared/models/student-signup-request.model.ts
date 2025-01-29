
export class StudentSignupRequestModel {
  id:string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  password: string;
  confirmPassword: string;
  oldPassword: string;
  systemLanguages: string[] = [];
  userName:string;
  groupMemberId:string;
}
