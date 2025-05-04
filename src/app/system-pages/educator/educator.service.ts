import { inject, Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ExpirationInfoComponent } from '../../shared/components/expiration-info/expiration-info.component';
import { UpgradePlanComponent } from '../../shared/components/upgrade-plan/upgrade-plan.component';
import { SubscriptionsApiService } from './shared/services/subscriptions.api.service';
import { StorageService } from '../../core/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class EducatorService {
  private service: SubscriptionsApiService = inject(SubscriptionsApiService);
  public dialogService: DialogService = inject(DialogService);
  private storage: StorageService = inject(StorageService);
  constructor() {}

  checkDays() {
    let userId: string = localStorage.getItem('userId') as string;
    this.service.GetStatus(userId).subscribe((resp) => {
      console.log(resp.data);
      if (resp.data.days <= 3 && resp.data.days >0 ) {
        if (!resp.data.isShown) {
          this.openExpirationDialog(resp.data);
        }
      }
      if(resp.data.days === 0){
        this.openExpirationDialog(resp.data);
      }

    });
  }

  openExpirationDialog(data: any) {
    const ref = this.dialogService.open(ExpirationInfoComponent, {
      width: '460px',
      data: data,
      style: {
        maxWidth: '95%',
      },
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.upgradePlan();
      }
    });
  }

  upgradePlan() {
    const ref = this.dialogService.open(UpgradePlanComponent, {
      width: '960px',
      style: {
        maxWidth: '95%',
      },
      data:1
    });
    ref.onClose.subscribe((e: any) => {
      if (e) {
        this.checkDays();
      }
    });
  }
}
