import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export class Confirmation {
  static confirm(
    confirmationService: ConfirmationService,
    translate: TranslateService,
    message: string,
    success: () => void,
  ) {
    confirmationService.confirm({
      header: translate.instant('Confirmation'),
      message: translate.instant(message),
      icon: 'pi pi-exclamation-circle',
      rejectButtonProps: {
        label: translate.instant('Cancel'),
        icon: 'pi pi-times',
        outlined: true,
        size: 'small',
      },
      acceptButtonProps: {
        label: translate.instant('Confirm'),
        icon: 'pi pi-check',
        size: 'small',
      },
      accept: () => success(),
      reject: () => {},
    });
  }
}
