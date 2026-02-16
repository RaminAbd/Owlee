import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location, NgClass, NgForOf, NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { UpsertHeadingComponent } from '../../../../../shared/components/upsert-heading/upsert-heading.component';
import { ActivatedRoute } from '@angular/router';
import { ApplicationMessageCenterService } from '../../../../../core/services/ApplicationMessageCenter.service';
import { FaqsUpsertService } from './faqs-upsert.service';
import { FaqsRequestModel } from '../../models/faqs-request.model';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-faqs-upsert',
  imports: [
    FormsModule,
    NgForOf,
    TranslatePipe,
    UpsertHeadingComponent,
    NgClass,
    DropdownModule,
  ],
  templateUrl: './faqs-upsert.component.html',
  styleUrl: './faqs-upsert.component.scss',
})
export class FaqsUpsertComponent {
  private service: FaqsUpsertService = inject(FaqsUpsertService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  public location: Location = inject(Location);
  public message: ApplicationMessageCenterService = inject(
    ApplicationMessageCenterService,
  );
  id = this.route.snapshot.paramMap.get('id') as string;
  request: FaqsRequestModel = new FaqsRequestModel();
  isSubmitted: boolean = false;
  types: any[] = [
    { name: 'Educators', value: 1 },
    { name: 'Students', value: 2 },
  ];
  constructor() {
    this.service.component = this;
    this.service.getInfo();
  }

  save() {
    this.isSubmitted = true;
    this.service.save();
  }
}
