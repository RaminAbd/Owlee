import { inject, Injectable } from '@angular/core';
import { StudentsApiService } from '../../services/students.api.service';
import { TranslateService } from '@ngx-translate/core';
import { BlobService } from '../../../../../core/services/blob.service';
import { StorageService } from '../../../../../core/services/storage.service';
import { AuthApiService } from '../../../../../auth/shared/services/auth.api.service';
import { KnownLanguagesApiService } from '../../../../known-languages/shared/services/known-languages.api.service';
import { ApplicationMessageCenterService } from '../../../../../core/services/ApplicationMessageCenter.service';
import { LanguageService } from '../../../../../core/services/language.service';
import { StudentSignupRequestModel } from '../../../../../auth/student-sign-up/shared/models/student-signup-request.model';
import { StudentDetailsComponent } from './student-details.component';
import { CoursesApiService } from '../../../../admin-courses/shared/services/courses.api.service';

@Injectable({
  providedIn: 'root',
})
export class StudentDetailsService {
  component: StudentDetailsComponent;
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
  private coursesService: CoursesApiService = inject(CoursesApiService);
  constructor() {}

  getDashboard() {
    let authResp = this.storage.getObject('authResponse');
    const req = {
      StudentId: this.component.id,
      lang: this.translate.currentLang,
    };
    this.coursesService.getDashboard(req).subscribe((resp) => {
      this.component.response = resp.data;
    });
  }

  getStudentInfo() {
    this.service
      .GetById(this.service.serviceUrl, this.component.id)
      .subscribe((resp) => {
        this.component.request = resp.data;
        if (!resp.data.systemLanguages)
          this.component.request.systemLanguages = [];
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
    this.component.request.phoneNumber =
      this.component.request.phoneNumber.toString();
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

  savePassword() {
    let req = {
      id: this.component.request.id,
      password: this.component.request.password,
    };
    this.authService.ChangePassword(req).subscribe((resp: any) => {});
  }
}
