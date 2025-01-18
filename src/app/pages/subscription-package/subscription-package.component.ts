import {Component, inject} from '@angular/core';
import {SubscriptionPackageService} from './subscription-package.service';
import {SubscriptionPackageModel} from './shared/models/subscription-package.model';
import {TableComponent} from '../../shared/components/table/table.component';

@Component({
  selector: 'app-subscription-package',
  imports: [
    TableComponent
  ],
  templateUrl: './subscription-package.component.html',
  styleUrl: './subscription-package.component.scss'
})
export class SubscriptionPackageComponent {
  private service:SubscriptionPackageService = inject(SubscriptionPackageService)
  subscriptionPackages:SubscriptionPackageModel[] = [];
  cols: any[] = [];
  constructor() {
    this.service.component = this;
    this.service.getAll()
    this.service.setCols()
  }

  tableActionHandler(e: any) {
    this.service.tableActionHandler(e);
  }


}
