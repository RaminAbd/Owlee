import { inject, Injectable } from '@angular/core';
import { SubscriptionPackageApiService } from './shared/services/subscription-package.api.service';
import { SubscriptionPackageComponent } from './subscription-package.component';
import { Router } from '@angular/router';
import { ApplicationMessageCenterService } from '../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionPackageService {
  private service: SubscriptionPackageApiService = inject(
    SubscriptionPackageApiService,
  );
  private router: Router = inject(Router);
  private appMessageService: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  component: SubscriptionPackageComponent;
  constructor() {}

  getAll() {
    this.service.GetAll(this.service.serviceUrl).subscribe((resp) => {
      this.component.subscriptionPackages = resp.data;
    });
  }

  setCols() {
    this.component.cols = [
      { field: 'name', header: 'Name' },
      { field: 'maxCapacity', header: 'Max Capacity' },
      { field: 'courseAmount', header: 'Course Amount' },
      { field: 'groupPerCourse', header: 'Group Per Course' },
      { field: 'peoplePerGroup', header: 'People Per Group' },
      { field: 'price', header: 'Price' },
      { field: 'crudActions', header: 'Actions' },
    ];
  }

  tableActionHandler(e: any) {
    switch (e.type) {
      case 1:
        this.router.navigate(['/main/admin/subscription-packages', 'create']);
        break;
      case 2:
        this.router.navigate(['/main/admin/subscription-packages', e.data.id]);
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
