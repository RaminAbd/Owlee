import {Injectable, OnDestroy} from '@angular/core';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationMessageCenterService {
  constructor(private messageService: MessageService, private translate: TranslateService,) {
  }

  handleError(response: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: response.error,
      life: 5000,
    });
    return null;
  }

  showSuccessMessage(header: string, message: string) {
    this.messageService.add({
      severity: 'success',
      summary: header,
      detail: message,
      sticky: false,
    });
  }

  showErrorMessage(header: string, message: string) {
    this.messageService.add({
      severity: 'error',
      summary: header,
      detail: message,
      sticky:false,
      life: 5000,
    });
  }

  showWarningMessage(header: string, message: string) {
    this.messageService.add({
      severity: 'warn',
      summary: header,
      detail: message,
      life: 5000,
      sticky: false,
    });
  }

  showInfoMessage(header: string, message: string) {
    this.messageService.add({
      severity: 'info',
      summary: header,
      detail: message,
      sticky: false,
    });
  }

  showTranslatedErrorMessage(messageKey: string) {
    var translatedString = this.translate.instant(messageKey);
    var translatedHeader = this.translate.instant('Error');
    this.showErrorMessage(translatedHeader, translatedString);
  }

  showTranslatedSuccessMessage(messageKey: string) {
    var translatedString = this.translate.instant(messageKey);
    var translatedHeader = this.translate.instant('Success');
    this.showSuccessMessage(translatedHeader, translatedString);
  }

  showTranslatedWarningMessage(messageKey: string) {
    var translatedString = this.translate.instant(messageKey);
    var translatedHeader = this.translate.instant('Warning');
    this.showWarningMessage(translatedHeader, translatedString);
  }

  showTranslatedInfoMessage(messageKey: string) {
    var translatedString = this.translate.instant(messageKey);
    var translatedHeader = this.translate.instant('Info');
    this.showInfoMessage(translatedHeader, translatedString);
  }
}
