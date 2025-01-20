import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, NgClass, NgForOf, NgIf } from '@angular/common';
import { SubscriptionPackageUpsertService } from './subscription-package-upsert.service';
import { SubscriptionPackageModel } from '../../models/subscription-package.model';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {UpsertHeadingComponent} from '../../../../../shared/components/upsert-heading/upsert-heading.component';
import {ApplicationMessageCenterService} from '../../../../../core/services/ApplicationMessageCenter.service';
@Component({
  selector: 'app-subscription-package-upsert',
  imports: [
    TranslatePipe,
    NgClass,
    FormsModule,
    UpsertHeadingComponent
  ],
  templateUrl: './subscription-package-upsert.component.html',
  styleUrl: './subscription-package-upsert.component.scss',
})
export class SubscriptionPackageUpsertComponent {
  private service: SubscriptionPackageUpsertService = inject(
    SubscriptionPackageUpsertService,
  );
  private route: ActivatedRoute = inject(ActivatedRoute);
  public location: Location = inject(Location);
  public message:ApplicationMessageCenterService = inject(ApplicationMessageCenterService)
  id = this.route.snapshot.paramMap.get('id') as string;
  request: SubscriptionPackageModel = new SubscriptionPackageModel();
  isSubmitted:boolean = false
  constructor() {
    this.service.component = this;
    this.service.getInfo();
  }

  save() {
    this.service.save()
  }
}
