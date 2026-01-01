import {inject, Injectable} from '@angular/core';
import {AdminFaqsComponent} from './admin-faqs.component';
import {FaqsApiService} from './shared/services/faqs.api.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ApplicationMessageCenterService} from '../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root'
})
export class AdminFaqsService {
  private service:FaqsApiService = inject(FaqsApiService)
  private translate: TranslateService = inject(TranslateService);
  private router: Router = inject(Router);
  private appMessageService: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  component: AdminFaqsComponent;

  getAll() {
    this.service
      .GetAllByLang(this.service.serviceUrl, this.translate.currentLang)
      .subscribe((resp) => {
        this.component.items = resp.data;
      });
  }


  setCols() {
    this.component.cols = [
      { field: 'title', header: 'Name' },
      { field: 'crudActions', header: 'Actions' },
    ];
  }

  tableActionHandler(e: any) {
    switch (e.type) {
      case 1:
        this.router.navigate(['/main/admin/faqs', 'create']);
        break;
      case 2:
        this.router.navigate(['/main/admin/faqs', e.data.id]);
        break;
      case 3:
        this.delete(e.data.id);
        break;
    }
  }

  private delete(id: any) {
    this.service.Delete(this.service.serviceUrl, id).subscribe((resp) => {
      if (resp.succeeded) {
        this.appMessageService.showTranslatedSuccessMessage(
          'Successfully deleted',
        );
        this.getAll();
      }
    });
  }
}
