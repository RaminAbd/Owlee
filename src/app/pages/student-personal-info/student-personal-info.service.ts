import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BlobService } from '../../core/services/blob.service';
import { StorageService } from '../../core/services/storage.service';
import { AuthApiService } from '../../auth/shared/services/auth.api.service';
import { KnownLanguagesApiService } from '../known-languages/shared/services/known-languages.api.service';
import { ApplicationMessageCenterService } from '../../core/services/ApplicationMessageCenter.service';
import { LanguageService } from '../../core/services/language.service';
import { EducatorSignupRequestModel } from '../../auth/sign-up/shared/models/educator-signup-request.model';
import { StudentPersonalInfoComponent } from './student-personal-info.component';
import { StudentsApiService } from '../students/shared/services/students.api.service';
import { StudentSignupRequestModel } from '../../auth/student-sign-up/shared/models/student-signup-request.model';

@Injectable({
  providedIn: 'root',
})
export class StudentPersonalInfoService {
  component: StudentPersonalInfoComponent;
  private service = inject(StudentsApiService);
  public translate = inject(TranslateService);
  private blob = inject(BlobService);
  private storage = inject(StorageService);
  private authService = inject(AuthApiService);
  private knownLangService = inject(KnownLanguagesApiService);
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  private langService: LanguageService = inject(LanguageService);
  constructor() {}

  getStudentInfo() {
    let id = localStorage.getItem('userId') as string;
    const req = {
      id: id,
      lang: this.translate.currentLang,
    };
    this.service.GetById(this.service.serviceUrl, id).subscribe((resp) => {
      this.component.request = resp.data;
      if (!resp.data.systemLanguages) this.component.request.systemLanguages = [];
      console.log(this.component.request);
    });
  }

  getLanguages() {
    this.knownLangService
      .GetAllByLang(
        this.knownLangService.serviceUrl,
        this.translate.currentLang,
      )
      .subscribe((resp) => {
        this.component.knownLangs = resp.data;
      });
  }

  save() {
    if (this.validate()) {
      this.component.mainLoading = true;
      this.updatePersonalInfo();
    }
  }

  updatePersonalInfo() {
    this.component.request.phoneNumber = this.component.request.phoneNumber.toString();
    this.service
      .Update(this.service.serviceUrl, this.component.request)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.message.showTranslatedSuccessMessage('Successfully updated!');
          this.getStudentInfo();
          this.component.isSubmitted = false;
          this.component.mainLoading = false;
        }
      });
  }

  validate() {
    let result = true;
    console.log(this.component.request);
    if (
      !this.component.request.firstName ||
      !this.component.request.lastName ||
      !this.component.request.phoneNumber ||
      !this.component.request.username ||
      !this.component.request.location ||
      this.component.request.systemLanguages.length === 0
    ) {
      result = false;
      this.message.showTranslatedWarningMessage('Fields are not valid');
    }

    if (!/^[a-zA-Z]+$/.test(this.component.request.firstName)) {
      this.message.showTranslatedWarningMessage('First name is not valid');
      result = false;
    }

    if (!/^[a-zA-Z]+$/.test(this.component.request.lastName)) {
      this.message.showTranslatedWarningMessage('Last name is not valid');
      result = false;
    }

    if (!/^\d{9}$/.test(this.component.request.phoneNumber)) {
      this.message.showTranslatedWarningMessage('Phone number is not valid');
      result = false;
    }

    return result;
  }

  getFile(e: any, fileHandler: any) {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append('file', files[i]);
      this.blob.UploadFile(fd).subscribe((resp: any) => {
        fileHandler(resp);
      });
    }
  }

  validatePasswords() {
    let result = true;
    if (
      !this.component.request.oldPassword ||
      !this.component.request.password ||
      !this.component.request.confirmPassword
    ) {
      result = false;
      this.message.showTranslatedWarningMessage('Fields are not valid');
    }

    if (
      this.component.request.password !== this.component.request.confirmPassword
    ) {
      this.message.showTranslatedWarningMessage('Passwords do not match');
      result = false;
    }

    let storage = this.storage.getObject('authRequest');
    if (storage.password !== this.component.request.oldPassword) {
      this.message.showTranslatedWarningMessage('Old password is not correct!');
      result = false;
    }

    if (!/^.{6,}$/.test(this.component.request.password)) {
      this.message.showTranslatedWarningMessage(
        'Password should be minimum 6 digits',
      );
      result = false;
    }

    return result;
  }

  savePassword() {
    console.log(this.component.request);
    let req = {
      id: this.component.request.id,
      password: this.component.request.password,
    };
    this.authService.ChangePassword(req).subscribe((resp: any) => {
      if (resp.succeeded) {
        this.message.showTranslatedSuccessMessage('Successfully updated!');

        this.component.passSubmitted = false;
        this.getStudentInfo();
        this.changeLocalStorage();

        this.component.request = new StudentSignupRequestModel();
      }
    });
  }

  changeLocalStorage() {
    let storage = this.storage.getObject('authRequest');
    storage.password = this.component.request.password;
    this.storage.saveObject('authRequest', storage);
  }
}
