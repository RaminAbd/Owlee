import { inject, Injectable } from '@angular/core';
import { HomeComponent } from './home.component';
import { SubscriptionPackageApiService } from '../subscription-package/shared/services/subscription-package.api.service';
import { EmailsApiService } from './shared/services/emails.api.service';
import { ApplicationMessageCenterService } from '../../core/services/ApplicationMessageCenter.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  component: HomeComponent;
  private service: SubscriptionPackageApiService = inject(
    SubscriptionPackageApiService,
  );
  private emailsService: EmailsApiService = inject(EmailsApiService);
  private message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  getAllPackages() {
    this.service.GetAll(this.service.serviceUrl).subscribe((resp) => {
      this.component.subscriptionPackages = resp.data;
    });
  }

  send() {
    this.emailsService
      .SendEmail(this.component.form.value)
      .subscribe((resp) => {
        if (resp.succeeded) {
          this.message.showTranslatedSuccessMessage('Successfully created!');
          this.component.form.reset();
          this.component.isSubmitted = false;
        }
      });
  }
}
