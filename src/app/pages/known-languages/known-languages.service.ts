import { inject, Injectable } from '@angular/core';
import { SubscriptionPackageApiService } from '../subscription-package/shared/services/subscription-package.api.service';
import { Router } from '@angular/router';
import { ApplicationMessageCenterService } from '../../core/services/ApplicationMessageCenter.service';
import { KnownLanguagesComponent } from './known-languages.component';
import { KnownLanguagesApiService } from './shared/services/known-languages.api.service';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class KnownLanguagesService {
  private service: KnownLanguagesApiService = inject(KnownLanguagesApiService);
  private router: Router = inject(Router);
  private appMessageService: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  public translate:TranslateService = inject(TranslateService);
  component: KnownLanguagesComponent;
  constructor() {}

  getAll() {
    this.service.GetAllByLang(this.service.serviceUrl, this.translate.currentLang).subscribe((resp) => {
      this.component.languages = resp.data;
    });
  }

  setCols() {
    this.component.cols = [
      { field: 'name', header: 'Name' },

      { field: 'crudActions', header: 'Actions' },
    ];
  }

  tableActionHandler(e: any) {
    switch (e.type) {
      case 1:
        this.router.navigate(['/main/admin/system-languages', 'create']);
        break;
      case 2:
        this.router.navigate(['/main/admin/system-languages', e.data.id]);
        break;
      case 3:
        this.delete(e.data.id);
        break;
    }
  }

  private delete(id: any) {
    this.service.Delete(this.service.serviceUrl, id).subscribe((resp) => {
      if (resp.succeeded) {
        this.appMessageService.showSuccessMessage(
          'Success!',
          'Successfully deleted',
        );
        this.getAll();
      }
    });
  }
}
