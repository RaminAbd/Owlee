import {Component, inject} from '@angular/core';
import {FaqsUpsertService} from '../../../../admin-faqs/shared/pages/faqs-upsert/faqs-upsert.service';
import {ActivatedRoute} from '@angular/router';
import {Location, NgClass, NgForOf} from '@angular/common';
import {ApplicationMessageCenterService} from '../../../../../core/services/ApplicationMessageCenter.service';
import {FaqsRequestModel} from '../../../../admin-faqs/shared/models/faqs-request.model';
import {CategoriesUpsertService} from './categories-upsert.service';
import {CategoriesRequestModel} from '../../models/categories-request.model';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {UpsertHeadingComponent} from '../../../../../shared/components/upsert-heading/upsert-heading.component';

@Component({
  selector: 'app-categories-upsert',
  imports: [
    DropdownModule,
    FormsModule,
    NgForOf,
    TranslatePipe,
    UpsertHeadingComponent,
    NgClass
  ],
  templateUrl: './categories-upsert.component.html',
  styleUrl: './categories-upsert.component.scss'
})
export class CategoriesUpsertComponent {
  private service: CategoriesUpsertService = inject(CategoriesUpsertService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  public location: Location = inject(Location);
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  id = this.route.snapshot.paramMap.get('id') as string;
  request: CategoriesRequestModel = new CategoriesRequestModel();
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
