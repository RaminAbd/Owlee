import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Location, NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {UpsertHeadingComponent} from '../../../../../shared/components/upsert-heading/upsert-heading.component';
import {
  KnownLanguagesUpsertService
} from '../../../../known-languages/shared/pages/known-languages-upsert/known-languages-upsert.service';
import {ActivatedRoute} from '@angular/router';
import {ApplicationMessageCenterService} from '../../../../../core/services/ApplicationMessageCenter.service';
import {KnownLanguagesRequestModel} from '../../../../known-languages/shared/models/known-languages-request.model';
import {FaqsUpsertService} from './faqs-upsert.service';
import {FaqsRequestModel} from '../../models/faqs-request.model';

@Component({
  selector: 'app-faqs-upsert',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    TranslatePipe,
    UpsertHeadingComponent,
    NgClass
  ],
  templateUrl: './faqs-upsert.component.html',
  styleUrl: './faqs-upsert.component.scss'
})
export class FaqsUpsertComponent {
  private service: FaqsUpsertService = inject(
    FaqsUpsertService,
  );
  private route: ActivatedRoute = inject(ActivatedRoute);
  public location: Location = inject(Location);
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  id = this.route.snapshot.paramMap.get('id') as string;
  request: FaqsRequestModel = new FaqsRequestModel();
  isSubmitted: boolean = false;
  constructor() {
    this.service.component = this;
    this.service.getInfo();
  }

  save() {
    this.isSubmitted = true;
    this.service.save();
  }
}
