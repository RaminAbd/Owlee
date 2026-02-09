export class StudentSignupRequestModel {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  password: string;
  confirmPassword: string;
  oldPassword: string;
  systemLanguages: string[] = [];
  username: string;
  groupMemberId: string;
  privacyAccepted: boolean = false;
  verificationCode: any;
  dateOfBirth: any;
}
