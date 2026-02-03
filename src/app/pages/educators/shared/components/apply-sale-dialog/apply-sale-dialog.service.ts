import { inject, Injectable } from '@angular/core';
import { ApplySaleDialogComponent } from './apply-sale-dialog.component';
import { SubscriptionsApiService } from '../../../../../system-pages/educator/shared/services/subscriptions.api.service';

@Injectable({
  providedIn: 'root',
})
export class ApplySaleDialogService {
  private service: SubscriptionsApiService = inject(SubscriptionsApiService);
  component: ApplySaleDialogComponent;
  constructor() {}

  applySale() {
    this.component.loading = true;
    const req = {
      educatorId: this.component.educatorId,
      sale: this.component.amount,
    };
    this.service.ApplySale(req).subscribe(
      (resp) => {
        if (resp.succeeded) {
          this.component.loading = false;
          this.component.ref.close(true);
        }
      },
      (error) => {
        this.component.loading = false;
      },
    );
  }
}
